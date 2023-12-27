import styles from '../styles/Header.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../reducers/user';
import { Popover } from 'react-tiny-popover';
import { LoadingIcon } from '../modules/LoadingIcon';
import '@vivid-planet/react-image/dist/react-image.css';


function Header(props) {

    const user = useSelector(state => state.user.value);
    const email = user.email;
    const [profilePicture, setProfilePicture] = useState('');


    useEffect(() => {

        (async () => {
            const config = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            }

            const response = await fetch('https://starchan-backend.vercel.app/users/getUser', config);
            const data = await response.json();
            data.result && setProfilePicture(data.user.link)
        })()

    }, [props.uploadSent])


    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter(); // Sert à naviguer entre les pages (comme le "href" dans le composant <Link>)

    const isLogged = user.token != null; // Variable qui renverra "true" si on a un token (donc si on est connecté), sinon "false"

    const logout = () => {
        dispatch(logoutUser());
        router.push('/');
    }


    const popoverContent = (
        <div className={styles.popoverContainer}>
            <ul className={styles.popoverList}>
                <li className={styles.popoverList_item} onClick={() => setIsPopoverOpen(false)}>
                    <Link href="/profile"> Votre profil </Link>
                </li>
                <li className={styles.popoverList_item}>
                    <div onClick={() => { logout(); setIsPopoverOpen(false) }}> Se déconnecter </div>
                </li>
            </ul>
        </div>
    )

    return (
        <div>
            <div className={styles.navContainer}>
                <div className={styles.nav}>

                    <div className={styles.logoContainer}>
                        <Image src="/images/logo2.png" alt="logo" layout='fill' onClick={() => router.push('/')} />
                    </div>


                    <div className={styles.linksContainer}>

                        <Link href="/" className={styles.navLink}> Accueil </Link>

                        <Link href={!isLogged ? '/login' : '/home'} className={styles.navLink}> Forum </Link>

                        {/* Quand on clique sur "Galerie" et qu'on est pas connecté, on nous envoie vers la page de connexion
                           avec un paramètre "galerie" dans le lien, qui permettra de savoir si on vient par le Link "Galerie" 
                           et donc nous rediriger au bon endroit une fois la connexion faite */}
                        <Link href={!isLogged
                            ? {
                                pathname: '/login',
                                query: { redirect: 'gallery' }
                            }
                            :
                            '/gallery'
                        }

                            className={styles.navLink}>
                            Galerie
                        </Link>

                        <Link href={!isLogged
                            ? {
                                pathname: '/login',
                                query: { redirect: 'actus' }
                            }
                            :
                            '/actus'
                        }
                            className={styles.navLink}> Actus </Link>
                    </div>





                    <div className={styles.logBtnContainer}>

                        {!isLogged
                            ?
                            <button className='btn login' onClick={() => router.push('/login')}>
                                Se connecter
                            </button>
                            :
                            <>
                                <Popover
                                    isOpen={isPopoverOpen}
                                    positions={['bottom']} // preferred positions by priority
                                    content={popoverContent}
                                    transform={{ left: -5, top: 3 }}
                                    transformMode='relative'
                                >

                                    <div className={styles.profileImg} onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                                        {profilePicture
                                            ?
                                            <Image src={profilePicture} width={80} height={80} alt="profileImg" />
                                            :
                                            <LoadingIcon src="" className={styles.loadingIcon} width={0} height={0} />
                                        }
                                    </div>

                                </Popover>
                            </>
                        }
                    </div>

                </div>
            </div>
        </div>

    );
}

export default Header;

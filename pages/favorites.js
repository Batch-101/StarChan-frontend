import styles from '../styles/Gallery.module.css';
import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Pictures from '../components/GalleryComps/Pictures';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { LoadingIcon } from '../modules/LoadingIcon';
import '@vivid-planet/react-image/dist/react-image.css';


Modal.setAppElement('body');


function FavoritesPage() {

    const [favorites, setFavorites] = useState([]);
    const [isFavoriteAdded, setIsFavoriteAdded] = useState(false);
    const [favoritesLoaded, setFavoritesLoaded] = useState(false);



    const email = useSelector(state => state.user.value.email);

    useEffect(() => {
        fetch(`https://starchan-backend.vercel.app/gallery/favorites/${email}`)
            .then(response => response.json())
            .then(favoritesData => {
                setFavorites(favoritesData.favorites);
            });
        setFavoritesLoaded(true)
    }, [isFavoriteAdded]);



    const updateFavoritePictures = async (pictureID) => {
        const config = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pictureID })
        }

        await fetch('https://starchan-backend.vercel.app/users/updateFavoritePictures', config);
        setIsFavoriteAdded(!isFavoriteAdded);

    }

    const favoritesElements = favorites.map((dataPhoto, i) => {

        return <Pictures id={dataPhoto._id} username={dataPhoto.user.username} link={dataPhoto.link} title={dataPhoto.title} key={i}{...dataPhoto} alt="photo" starColor={{ color: "yellow" }} updateFavoritePictures={updateFavoritePictures} />;
    })


    return (
        <>
            <Head>
                <title>StarChan - Mes favoris</title>
            </Head>
            <Header />

            <div className={styles.main}>
                <div className={styles.container}>
                    <h1 className='title'>Galerie photos</h1>

                    {favoritesLoaded
                        ?
                        (
                            favoritesElements.length
                                ?
                                <div className={styles.containerGalleryPhoto}>{favoritesElements.reverse()}</div>
                                :
                                <div className={styles.containerGalleryPhoto}>
                                    <p style={{ width: '100%', textAlign: 'center' }}>Vous n'avez pas encore de photos en favoris.</p>
                                </div>
                        )
                        :
                        <LoadingIcon src="" className={styles.loadingIcon} width={0} height={0} />
                    }

                    <div className={styles.favoriteBtnContainer}>
                        <Link className='btn newSubject' href="/gallery"> Retour à la galerie </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        width: '590px',
        marginRight: '-50%',
        transform: 'translate(-50%, -60%)',
        backgroundColor: '#21274A',
        border: "none",
        borderRadius: "10px"

    },
};

export default FavoritesPage;

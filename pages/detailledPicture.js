import styles from '../styles/DetailledPicture.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import TimeAgo from '../modules/TimeAgo'
import Link from 'next/link';


function detailledPicture(props) {

    const router = useRouter();
    const pictureId = router.query.q;
    const [pictureData, setPictureData] = useState({});


    useEffect(() => {
        if (router.isReady) {
            fetch(`https://starchan-backend.vercel.app/gallery/${pictureId}`)
                .then(response => response.json())
                .then(data => {
                    setPictureData(data.picture)
                })
        }
    }, [router.isReady])


    return (
        pictureData.title &&
        <div className={styles.containerWrapper}>
            <p className={styles.titlePicture} >{pictureData.title}</p>
            <div className={styles.container}>


                <div className={styles.pictureAndProfileContainer}>

                    <div className={styles.pictureDetailledContainer}>
                        {pictureData.link && <Image src={pictureData.link} alt={props.title} width="500" height="500" />}
                        <p className={styles.place}>Lieu : {pictureData.place}</p>
                    </div>


                    <div className={styles.profilImage}>
                        <Image src={pictureData.user.link} width={100} height={100} alt="profileImg" className={styles.imgProfile} />

                        <p className={styles.text}>{pictureData.user.username}</p>
                        <p className={styles.text}>{TimeAgo(pictureData.date)}</p>

                    </div>


                </div>
                <div className={styles.textContainer}>

                    <p className={styles.text1}>{pictureData.description} </p>

                </div>

            </div>

            <div className={styles.galleryContainer}>
                <Link className='btn newSubject' href="/gallery"> Retour à la galerie </Link>
            </div>
        </div>


    )

}









export default detailledPicture;
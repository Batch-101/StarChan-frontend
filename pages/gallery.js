import Header from '../components/Header';
import styles from '../styles/Gallery.module.css';
import Pictures from '../components/GalleryComps/Pictures';
import NewPicture from '../components/GalleryComps/NewPicture';
import Modal from 'react-modal';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LoadingIcon } from '../modules/LoadingIcon';
import '@vivid-planet/react-image/dist/react-image.css';


Modal.setAppElement('body');

function GalleryPage() {

    const [galleryPhoto, setGalleryPhoto] = useState([]);
    const [isPhotoAdded, setIsPhotoAdded] = useState(false);
    const [isFavoriteAdded, setIsFavoriteAdded] = useState(false);
    const [user, setUser] = useState({});
    const [galleryLoaded, setGalleryLoaded] = useState(false);

    const email = useSelector(state => state.user.value.email);

    // à chaque ajout d'une photo la galerie se met à jour

    useEffect(() => {
        fetch('https://starchan-backend.vercel.app/gallery')
            .then(response => response.json())
            .then(dataPhoto => {
                setGalleryPhoto(dataPhoto.pictures);
                setGalleryLoaded(true)
            });
    }, [isPhotoAdded]);

    // à chaque ajout d'une photo en favoris, la galerie se met à jour

    useEffect(() => {
        (async () => {
            const config = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            }
            const response = await fetch('https://starchan-backend.vercel.app/users/getUser', config);
            const userData = await response.json();
            setUser(userData.user)
        })();
    }, [isFavoriteAdded]);


    const photoAdded = () => {
        setIsPhotoAdded(!isPhotoAdded);
        closeModal();
    }

    // paramétrage du modal

    const [modalIsOpen, setIsOpen] = useState(false);
    const [newPictureClicked, setNewPictureClicked] = useState(false);


    // modal pour poster la nouvelle photo

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    // Met à jour les photos en favoris de l'utilisateur

    const updateFavoritePictures = async (pictureID) => {
        const config = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pictureID })
        }

        await fetch('https://starchan-backend.vercel.app/users/updateFavoritePictures', config);
        setIsFavoriteAdded(!isFavoriteAdded);

    }

    // Récupérer les informations des images s'il y en a pour mettre à jour la galerie

    const gallery = galleryPhoto.map((dataPhoto, i) => {
        if (user.username) {
            const isPictureIncluded = user.favoritePictures.some(picture => picture._id == dataPhoto._id);
            const starColor = isPictureIncluded ? { color: 'yellow' } : {};
            return <Pictures id={dataPhoto._id} username={dataPhoto.user.username} link={dataPhoto.link} title={dataPhoto.title} key={i}{...dataPhoto} alt="photo" updateFavoritePictures={updateFavoritePictures} starColor={starColor} />;
        }
    })


    return (
        <>
            <Head>
                <title>StarChan - Galerie photo</title>
            </Head>
            <Header />

            <div className={styles.main}>
                <div className={styles.container}>

                    <h1 className='title'>Galerie photos</h1>

                    <div className={styles.groupBtnContainer}>

                        <div className={styles.btnContainer}>
                            <Link className='btn newSubject' href="/favorites"> Vos favoris </Link>
                            <button className='btn newSubject'
                                onClick={() => { setNewPictureClicked(true); openModal() }}
                            >
                                Poster une photo
                            </button>
                        </div>

                    </div>

                    {galleryLoaded
                        ?
                        (
                            gallery.length
                                ?
                                <div className={styles.containerGalleryPhoto}>{gallery.reverse()}</div>
                                :
                                <div className={styles.containerGalleryPhoto}>
                                    <p style={{ width: '100%', textAlign: 'center' }}>Il n'y a pas encore de photos.</p>
                                </div>
                        )
                        :
                        <LoadingIcon src="" className={styles.loadingIcon} width={0} height={0} />
                    }



                </div>

                {/* mise en place du modal */}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="NewPicture Modal"
                    className={styles.Modal}
                    overlayClassName={styles.Overlay}
                    style={customStyles}
                >
                    {<NewPicture photoAdded={photoAdded} closeModal={closeModal} />}

                </Modal>

            </div>
        </>
    )
}

// css de la modale

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

export default GalleryPage;

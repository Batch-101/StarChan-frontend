import React from 'react'
import Files from 'react-files';
import styles from '../../styles/NewPicture.module.css'
import forbiddenWords from '../../modules/forbiddenWords';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';


function NewPicture(props) {

    const connectedUser = useSelector(state => state.user.value);
    const [userId, setUserId] = useState('');
    const [photoTitle, setPhotoTitle] = useState('');
    const [photoPlace, setPhotoPlace] = useState('');
    const [photoDescription, setPhotoDescription] = useState('');
    const [imgFile, setImgFile] = useState('');

    // à l'initialisation de la page on récupère l'ID de l'utilisateur

    useEffect(() => {
        (async () => {
            const config = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: connectedUser.email })
            }

            const response = await fetch('https://starchan-backend.vercel.app/users/getUser', config);
            const data = await response.json();

            setUserId(data.user._id);

        })()
    }, []);


    // vérifier si tous les champs obligatoires sont bien remplis

    const isTitleValid = photoTitle.length > 0;
    const isPhotoPlaceValid = photoPlace.length > 0;
    const isPhotoDescriptionValid = photoDescription.length > 0;
    const isFile = imgFile.id != undefined;

    const isFormValid = isTitleValid && isPhotoPlaceValid && isPhotoDescriptionValid && isFile;

    // insérer la photo par cliquer glisser ou par l'ouverture de l'explorateur de fichiers

    const handleChange = (files) => {
        setImgFile(files[0] ? files[0] : '');
    }

    const handleError = (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message)
    }

    const uploadImage = async () => {
        if (imgFile.id) {
            const formData = new FormData();

            formData.append('image', imgFile);

            const response = await fetch(`https://starchan-backend.vercel.app/pictures/uploadToGallery`, { method: 'POST', body: formData })
            const data = await response.json();

            if (data.result) {
                console.log('image updated')
                return data.url;
            } else {
                alert("Votre image est trop volumineuse (max 4.5Mo)");
                console.log('image update failed')
            }

        }
    }

    // créer la nouvelle photo en mettant à jour la base de donnée

    const createNewPhoto = async () => {

        let link = "";

        if (imgFile.id) {
            link = await uploadImage();
        }

        const config = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: userId,
                title: forbiddenWords(photoTitle),
                description: forbiddenWords(photoDescription),
                place: forbiddenWords(photoPlace),
                link,
            }),
        }

        const photoResponse = await fetch('https://starchan-backend.vercel.app/gallery/newPicture', config);
        const photoData = await photoResponse.json();

        photoData.result && props.photoAdded();
    }

    return (

        <div className={styles.formPicture}>

            <div className={styles.xMarkContainer}>
                <FontAwesomeIcon icon={faXmark} className={styles.xMark} onClick={() => props.closeModal()} />
            </div>
            <p className={styles.titleSubject} >Ajouter une nouvelle photo</p>
            <div className={styles.inputContainer}>
                <input className={`input ${styles.inputText}`} onChange={(e) => setPhotoTitle(e.target.value)} value={photoTitle} type="text" placeholder="Titre" />
                {!isTitleValid &&
                    <p className={styles.warning} style={{ marginBottom: 0 }}>Veuillez remplir ce champ.</p>
                }
            </div>

            {/* création de l'encart pour cliquer glisser ou télécharger l'image */}

            <div className={styles.imgContainer}>
                <Files
                    className={styles.subjectImg}
                    onChange={handleChange}
                    onError={handleError}
                    accepts={['image/png', 'image/jpg', 'image/jpeg']}
                    maxFileSize={4500000}
                    minFileSize={0}
                    clickable>
                    {imgFile
                        ?
                        <img src={imgFile.preview.url ? imgFile.preview.url : ''} alt="Insérer une image" data-tooltip-id="imgTooltip" />
                        :
                        <p className={styles.insertImg} data-tooltip-id="imgTooltip">Insérer une image</p>
                    }
                </Files>

            </div>
            <Tooltip id="imgTooltip" style={{ maxWidth: 450, backgroundColor: "#391c4d", opacity: 1, color: "#ebe7c3" }} content="Cliquez ou glissez votre image (formats autorisés: .png, .jpg, .jpeg, max 4.5Mo)" />

            <div className={styles.inputContainer}>
                <input className={`input ${styles.inputText}`} onChange={(e) => setPhotoPlace(e.target.value)} value={photoPlace} type="text" placeholder="Lieu de prise de votre photo" />
                {!isPhotoPlaceValid &&
                    <p className={styles.warning} style={{ marginBottom: 0 }}>Veuillez remplir ce champ.</p>
                }
            </div>

            <div className={styles.inputContainer}>

                <textarea className={`input ${styles.textarea}`} onChange={(e) => setPhotoDescription(e.target.value)} value={photoDescription} type="text" placeholder="Description, matériel utilisé..." />
                {!isPhotoDescriptionValid &&
                    <p className={styles.warning} style={{ marginBottom: 0 }}>Veuillez remplir ce champ.</p>
                }

            </div>

            {/* le bouton devient cliquable si tous les champs obligatoires sont remplis */}

            <div className={styles.validation}>
                {isFormValid
                    ?
                    <button className={'btn newSubject'} style={{ fontWeight: 'bold' }} id="subject" onClick={() => createNewPhoto()}>Poster la photo</button>
                    :
                    <button className={`btn ${styles.disabled}`}>Poster votre photo</button>
                }
            </div>

        </div>

    )

}

export default NewPicture;
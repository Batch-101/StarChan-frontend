import styles from '../styles/Profile.module.css';
import { useEffect } from 'react';
import Header from '../components/Header';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import Files from 'react-files';
import { updateEmail } from '../reducers/user';
import { LoadingIcon } from '../modules/LoadingIcon';
import '@vivid-planet/react-image/dist/react-image.css';
import Modal from 'react-modal';
import ForbiddenAccess from '../components/ForbiddenAccess';



Modal.setAppElement('body');


function ProfilePage() {

    const user = useSelector(state => state.user.value);

    useEffect(() => {
        if (!user.token) {
            return <ForbiddenAccess />
        }
    }, [])

    const currentEmail = user.email;
    const [currentUsername, setCurrentUsername] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState(currentEmail);
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [imgFile, setImgFile] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [uploadSent, setUploadSent] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);


    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const config = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: updatedEmail })
            }

            const response = await fetch('https://starchan-backend.vercel.app/users/getUser', config)
            const data = await response.json();

            setCurrentUsername(data.user.username);
            setUpdatedUsername(data.user.username);
            setProfilePicture(data.user.link);

        })()
    }, [uploadSent]);



    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Vérification du nom d'utilisateur : autorise les lettres, chiffres, tirets bas et tirets moyens
    const usernameRegex = /^[A-Za-zÀ-Üà-ü0-9_-]+$/;

    // Vérification du format de l'adresse e-mail en utilisant une expression régulière
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    // Vérification des caractères spéciaux dans le nom d'utilisateur
    const checkSpecialCharacter = usernameRegex.test(updatedUsername);

    // Vérification de la longueur du nom d'utilisateur entre 4 et 15 caractères
    const checkUsernameLength = 4 <= updatedUsername.length && updatedUsername.length <= 15;

    // Vérification finale de la validité du nom d'utilisateur
    const isUsernameValid = checkSpecialCharacter && checkUsernameLength;

    // Vérification de la validité de l'adresse e-mail et de sa longueur maximale
    const isEmailValid = emailRegex.test(updatedEmail) && updatedEmail.length <= 100;

    // Vérification de la longueur du mot de passe entre 8 et 50 caractères
    const isPasswordValid = password.length == 0 || password.length >= 8 && password.length <= 50;

    // Vérification de la correspondance entre le mot de passe et la confirmation du mot de passe
    const isConfirmPasswordValid = password === confirmPassword;

    // Vérification globale de la validité du formulaire
    const isFormValid = isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;


    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const updateProfile = async (username, email, password) => {

        if (imgFile.id) {
            const formData = new FormData();

            formData.append('image', imgFile);

            const response = await fetch(`https://starchan-backend.vercel.app/pictures/uploadToProfile/${currentEmail}`, { method: 'POST', body: formData })
            const data = await response.json();

            if (data.result) {
                console.log('image updated')
            } else {
                console.log('image update failed')
            }

        }


        if (username && username !== currentUsername) {
            const config = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updatedUsername: username, currentUsername, currentEmail }),
            }


            const response = await fetch('https://starchan-backend.vercel.app/users/updateUsername', config)
            const data = await response.json();

            if (data.result) {
                console.log('username updated')
            } else {
                alert("Le pseudo existe déjà");
                console.log('username update failed')
            }
        };


        if (password) {
            const config = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updatedPassword: password, currentEmail }),
            }


            const response = await fetch('https://starchan-backend.vercel.app/users/updatePassword', config)
            const data = await response.json();

            if (data.result) {
                console.log('password updated')
            } else {
                console.log('password update failed')
            }

            setPassword('');
            setConfirmPassword('');
        };



        if (email && email !== currentEmail) {

            const config = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updatedEmail: email, currentEmail }),
            }


            const response = await fetch('https://starchan-backend.vercel.app/users/updateEmail', config)
            const data = await response.json();

            if (data.result) {
                dispatch(updateEmail(email))
                console.log('email updated', data.error)
            } else {
                alert("L'adresse mail existe déjà");
                console.log('email update failed')
                setUpdatedEmail(currentEmail)
            }
        }

    };

    const loading = async (username, email, password) => {
        openModal();
        await updateProfile(username, email, password)
        closeModal();
        setUploadSent(!uploadSent);
    }

    const handleChange = (files) => {
        setImgFile(files[0]);
    }

    const handleError = (error, file) => {
        alert("Votre image est trop volumineuse (max 4.5Mo)");
        console.log('error code ' + error.code + ': ' + error.message)
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
            width: '500px',
            marginRight: '-50%',
            transform: 'translate(-50%, -60%)',
            backgroundColor: '#21274A',
            border: "none",
            borderRadius: "10px"

        },
    };


    return (
        <>
            <Header uploadSent={uploadSent} />
            <div className={styles.container}>
                <div className={styles.imgContainer}>
                    <Files
                        className={styles.profileImg}
                        onChange={handleChange}
                        onError={handleError}
                        accepts={['image/png', 'image/jpg', 'image/jpeg']}
                        maxFileSize={4500000}
                        minFileSize={0}
                        clickable>
                        <img data-tooltip-id="imgTooltip" src={imgFile.preview.url ? imgFile.preview.url : profilePicture} alt="profileImg" />
                        <FontAwesomeIcon icon={faPen} className={styles.penIcon} />
                    </Files>
                    <Tooltip id="imgTooltip" style={{ maxWidth: 450, backgroundColor: "#391c4d", opacity: 1, color: "#ebe7c3" }} content="Cliquez ou glissez votre image (formats autorisés: .png, .jpg, .jpeg, max 4.5Mo)" />
                </div>
                <div className={styles.infoContainer}>

                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Votre pseudo</p>
                        <input className={`input ${styles.profileInput}`} type="text" onChange={e => setUpdatedUsername(e.target.value)} value={updatedUsername} />

                        {/* Affichage du message d'avertissement pour les caractères spéciaux dans le pseudo */}

                        {!checkSpecialCharacter && updatedUsername.length > 0
                            && <p className={styles.warning} style={{ marginBottom: 0 }}>Les caractères spéciaux autorisés sont: - et _</p>
                        }

                        {/* Affichage du message d'avertissement pour la longueur du pseudo */}
                        {!checkUsernameLength && updatedUsername.length > 0
                            && <p className={styles.warning}>Votre pseudo doit contenir entre 4 et 15 caractères</p>
                        }
                    </div>

                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Votre email</p>
                        <input className={`input ${styles.profileInput}`} type="email" onChange={e => setUpdatedEmail(e.target.value)} value={updatedEmail} />

                        {/* Affichage du message d'avertissement pour une adresse e-mail invalide */}
                        {!isEmailValid && updatedEmail.length > 0
                            && <p className={styles.warning}>Veuillez entrer un email valide</p>
                        }
                    </div>

                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Modifier votre mot de passe</p>
                        <input className={`input ${styles.profileInput}`} type="password" onChange={e => setPassword(e.target.value)} value={password} />

                        {/* Affichage du message d'avertissement pour la longueur du mot de passe */}
                        {!isPasswordValid && password.length > 0
                            && <p className={styles.warning}>Votre mot de passe doit contenir au moins 8 caractères</p>
                        }
                    </div>

                    <div className={styles.inputContainer}>
                        <p className={styles.label}>Confirmer votre mot de passe</p>
                        <input className={`input ${styles.profileInput}`} type="password" onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword} />

                        {/* Affichage du message d'avertissement pour la confirmation du mot de passe */}
                        {!isConfirmPasswordValid && confirmPassword.length > 0
                            && <p className={styles.warning}>Les mots de passe doivent être identiques</p>
                        }
                    </div>

                    {/* Affichage du bouton "S'inscrire" activé ou désactivé en fonction de la validité du formulaire */}
                    {isFormValid
                        ?
                        <button className={`btn newSubject ${styles.updateBtn}`} id="update" onClick={() => loading(updatedUsername, updatedEmail, password)}>Enregistrer</button>
                        :
                        <button className={`btn ${styles.disabled}`}>Enregistrer</button>
                    }

                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        contentLabel="Example Modal"
                        className={styles.Modal}
                        overlayClassName={styles.Overlay}
                        style={customStyles}
                        shouldCloseOnOverlayClick={false}
                    >
                        {
                            <div className={styles.loadingContainer}>
                                <p className={styles.loadingTitle}>Modification en cours, veuillez patienter...</p>
                                <LoadingIcon src="" className={styles.loadingIcon} />
                            </div>
                        }
                    </Modal>
                </div>
            </div>
        </>)
}

export default ProfilePage;
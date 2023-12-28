import styles from '../styles/AnswerPage.module.css';
import NewAnswer from '../components/ForumComps/NewAnswer';
import Answer from '../components/ForumComps/Answer';
import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import ForbiddenAccess from '../components/ForbiddenAccess';
import { useRouter } from 'next/router';
import { LoadingIcon } from '../modules/LoadingIcon';
import '@vivid-planet/react-image/dist/react-image.css';

Modal.setAppElement('body')

function SubjectPage() {

    const [isOpen, setIsOpen] = useState(false);
    const [isAnswerAdded, setIsAnswerAdded] = useState(false);
    const [subjectAnswers, setSubjectAnswers] = useState([]);
    const [subject, setSubject] = useState({});
    const [connectedUser, setConnectedUser] = useState(useSelector(state => state.user.value));
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteModalText, setDeleteModalText] = useState('');

    const router = useRouter();
    const subjectID = router.query.q;
    const categoryID = router.query.r;

    const [answerToDelete, setAnswerToDelete] = useState('');

    const [answersLoaded, setAnswersLoaded] = useState(false);


    {/* Le hook d'effet permet d'empêcher les utilisateurs non enregistrer à accéder au sujet.
    Il utilise la variable d'état connectedUser pour déterminer si l'utilisateur s'est créer un compte
    en utilisant le reducer user. Le reducer est censé retourner un token unique à l'utilisateur s'il s'est inscrit. */ }
    useEffect(() => {
        if (!connectedUser.token) {
            return <ForbiddenAccess />
        }
    }, [])

    useEffect(() => {
        {/* cet useEffect récupère les données utilisateur du serveur lorsque le composant monte et met à jour 
        l'état connectedUser avec les données utilisateur obtenues.*/}
        (async () => {

            const config = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: connectedUser.email }),
            };

            const response = await fetch('https://starchan-backend.vercel.app/users/getUser', config);
            const data = await response.json();
            setConnectedUser(data.user);
        })()
    }, []);


    useEffect(() => {
        {/* Le hook d'effet permet d'aller chercher les informations sur le sujets sélectionné */ }
        if (router.isReady) {
            fetch(`https://starchan-backend.vercel.app/subjects/${subjectID}`)
                .then(response => response.json())
                .then(dataAnswer => {
                    setSubject(dataAnswer.subject);
                    setSubjectAnswers(dataAnswer.subject.answers);
                    setAnswersLoaded(true);
                })
        }
        //router.isReady permet de gérer le cas lorsqu'on actualise la page
    }, [router.isReady, isAnswerAdded])


    {/* Cette modal sert à afficher une variable d'état permettant de supprimer un sujet créer par l'utilisateur l'ayant créé */ }
    const openDeleteModal = (id) => {
        setDeleteModalText(id === subjectID && "Attention: Vous êtes sur le point de supprimer l'intégralité du sujet.")
        setIsDeleteModalOpen(true);
        setAnswerToDelete(id);
    }

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setAnswerToDelete('');
    }
    {/* La constante deleteAnswer permet de supprimer un sujet et/ou un une réponse créé par l'utilisateur en question.
    Pour se faire, la constante fait un fetch au backend vers la route pour supprimer le sujet et/ou la réponse */}
    const deleteAnswer = async () => {

        if (answerToDelete == subjectID) {
            const config = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryID, subjectID })
            };

            await fetch('https://starchan-backend.vercel.app/subjects/deleteSubjectById', config);
            closeDeleteModal();
            router.push('/home');

        } else {

            const config = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subjectID, answerID: answerToDelete })
            };

            await fetch('https://starchan-backend.vercel.app/subjects/deleteAnswerFromSubjectById', config);
            setIsAnswerAdded(!isAnswerAdded);
            closeDeleteModal();
        }

    }


    {/* La constante listedAnswer transforme un tableau de données de réponse (subjectAnswers)
    en un tableau de composants React (Composants de réponse), chaque composant recevant des propriétés
    spécifiques basées sur les données de réponse correspondantes et l'utilisateur connecté. */}
    const listedAnswer = subjectAnswers.map((answer, i) => {
        return <Answer key={i} {...answer} connectedUser={connectedUser} openDeleteModal={openDeleteModal} />
    })

    {/* Vérifie si subject.title est truthy, et si tel est le cas, il ajoute un nouveau composant
    Answer basé sur l'objet subject au début du tableau ListAnswer. La clé de ce nouveau composant est définie pour garantir
    l'unicité au sein du tableau. */}
    subject.title && listedAnswer.unshift(<Answer {...subject} key={listedAnswer.length} connectedUser={connectedUser} openDeleteModal={openDeleteModal} isSubject={true} />);

    // Permet de fermer la modal lorsque qu'une réponse a été posté
    function answerAdded() {
        setIsAnswerAdded(!isAnswerAdded);
        closeModal();
    }



    // Modal pour créer réponse 

    function openModal() {
        setIsOpen(true)
    }

    function closeModal() {
        setIsOpen(false)
    }



    return (
        <>
            <Header />

            <div className={styles.main}>
                <div className={styles.container}>

                    <h2 className={styles.answerTo}>Répondre au sujet:</h2>
                    <h3 className={styles.subjectTitle}>{subject.title}</h3>


                    {answersLoaded
                        ?
                        <>
                            {listedAnswer}
                            <div className={styles.btnContainer}>
                                <button className='btn newSubject' onClick={() => openModal()}>
                                    Nouvelle Réponse
                                </button>
                            </div>
                        </>
                        :
                        <LoadingIcon src="" className={styles.loadingIcon} width={0} height={0} />
                    }

                </div>

            </div>



            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                contentLabel="NewAnswer Modal"
                className={styles.Modal}
                overlayClassName={styles.Overlay}
                style={customStylesSubject}
            >
                <NewAnswer subjectID={subjectID} username={connectedUser} closeModal={closeModal} answerAdded={answerAdded} />

            </Modal>


            <Modal
                isOpen={isDeleteModalOpen}
                onRequestClose={closeDeleteModal}
                contentLabel="Delete Category Modal"
                className={styles.Modal}
                overlayClassName={styles.Overlay}
                style={customStyles}
                shouldCloseOnOverlayClick={false}
            >
                {
                    <div className={styles.deleteContainer}>
                        {deleteModalText && <p className={`${styles.deleteTitle} ${styles.warning}`}> {deleteModalText} </p>}
                        <p className={styles.deleteTitle}>{deleteModalText ? "Voulez vous quand même continuer?" : "Confirmer la suppression de la réponse?"} </p>

                        <div className={styles.deleteBtnContainer}>

                            <button className={`btn newSubject ${styles.deleteBtn}`} onClick={() => deleteAnswer()}>
                                Oui
                            </button>

                            <button className={`btn login ${styles.deleteBtn}`} onClick={closeDeleteModal}>
                                Annuler
                            </button>
                        </div>
                    </div>

                }
            </Modal>

        </>

    )
}

const customStylesSubject = {
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
        width: '750px',
        height: '725px',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#21274A',
        border: "none",
        borderRadius: "10px",
        overflow: "auto",
        padding: "20px"
    },
};



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

export default SubjectPage;

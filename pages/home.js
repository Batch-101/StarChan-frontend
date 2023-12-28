import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Category from '../components/ForumComps/Category';
import NewCategory from '../components/ForumComps/NewCategory';
import NewSubjects from '../components/ForumComps/newSubjects';
import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import ForbiddenAccess from '../components/ForbiddenAccess';
import { LoadingIcon } from '../modules/LoadingIcon';
import '@vivid-planet/react-image/dist/react-image.css';

Modal.setAppElement('body');

function HomePage() {

    const connectedUser = useSelector(state => state.user.value);

    useEffect(() => {
        if (!connectedUser.token) {
            return <ForbiddenAccess />
        }
    }, []);


    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalIsOpen1, setIsOpen1] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [isSubjectAdded, setIsSubjectAdded] = useState(false);
    const [isCategoryAdded, setIsCategoryAdded] = useState(false);

    const [newCategoryClicked, setNewCategoryClicked] = useState(false);
    const [newSubjectClicked, setNewSubjectClicked] = useState(false);
    const [searchKeywords, setSearchKeywords] = useState('');
    const [categories, setCategories] = useState([]);

    const [searching, setSearching] = useState(false);
    const [matchingSubjects, setMatchingSubjects] = useState([]);
    const [isResearchReseted, setIsReserchReseted] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);

    const [categoryToDelete, setCategoryToDelete] = useState('');

    const [categoriesLoaded, setCategoriesLoaded] = useState(false);




    useEffect(() => {

        (async () => {

            const config = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: connectedUser.email }),
            };

            const response = await fetch('https://starchan-backend.vercel.app/users/getUser', config);
            const data = await response.json();
            setIsUserAdmin(data.user.isAdmin);
        })()
    }, []);



    useEffect(() => {
        (async () => {
            const response = await fetch('https://starchan-backend.vercel.app/categories');
            const data = await response.json();
            setCategories(data.categories);
            setCategoriesLoaded(true);
        })()
    }, [isSubjectAdded, isCategoryAdded, isResearchReseted])



    //modal pour crer la catégorie

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function categoryAdded() {
        setIsCategoryAdded(!isCategoryAdded);
        closeModal();
    }

    // modal pour créer un sujet

    function openModal1() {
        setIsOpen1(true);
    }

    function closeModal1() {
        setIsOpen1(false);
    }


    const openDeleteModal = (id) => {
        setIsDeleteModalOpen(true);
        setCategoryToDelete(id);
    }

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCategoryToDelete('');
    }

    const deleteCategory = async () => {
        const config = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: categoryToDelete }),
        };

        await fetch('https://starchan-backend.vercel.app/subjects/deleteSubjectsFromCategory', config);

        setIsCategoryAdded(!isCategoryAdded);
        closeDeleteModal();
    }


    const subjectAdded = () => {
        setIsSubjectAdded(!isSubjectAdded);
        closeModal1();
    }


    const searchSubjects = async () => {
        let keywords = searchKeywords.trim(); //Supprime les espaces avant et après la string

        if (!keywords) {
            setIsReserchReseted(!isResearchReseted);
            setSearching(false);
            return
        }

        keywords = keywords.split(' ');
        const config = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keywords }),
        }

        const subjResponse = await fetch('http://localhost:3000/home/search', config);
        const subjData = await subjResponse.json();

        if (subjData.result) {
            setMatchingSubjects(subjData.subjects);
            setSearching(true);
        } else {
            alert("Aucun sujet trouvé");
        }
    };

    const categoriesElements = categories.map((e, i) => {
        return <Category
            key={i}
            title={e.title}
            id={e._id}
            isSubjectAdded={isSubjectAdded}
            matchingSubjects={matchingSubjects}
            searching={searching}
            openDeleteModal={openDeleteModal}
            isUserAdmin={isUserAdmin}
        />
    })


    return (
        <>
            <Head>
                <title>StarChan - Forum</title>
            </Head>
            <Header />

            <div className={styles.main}>
                <div className={styles.container}>

                    <h1 className='title'>Forum</h1>

                    <div className={styles.searchContainer}>
                        <div className={styles.searchInputBlock}>
                            <input
                                className='input search'
                                type="search"
                                placeholder="Recherche de sujet"
                                maxLength={100}
                                onChange={(e) => { setSearchKeywords(e.target.value) }}
                                value={searchKeywords}
                                onKeyDown={e => e.key == 'Enter' && searchSubjects()}
                            />
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className={`${styles.magnifyingGlass} icon`}
                                onClick={searchSubjects}
                            />
                        </div>

                        <div className={styles.btnContainer}>
                            {isUserAdmin &&
                                <button className='btn newSubject' style={{ width: 185 }} onClick={() => { setNewCategoryClicked(true); openModal() }}>
                                    Nouvelle catégorie
                                </button>
                            }
                            <button className='btn newSubject' onClick={() => { setNewSubjectClicked(true); openModal1() }} style={{ marginLeft: 75 }}>
                                Nouveau sujet
                            </button>
                        </div>
                    </div>


                    {categoriesLoaded
                        ?
                        (
                            categoriesElements.length
                                ?
                                categoriesElements.sort((a, b) => a.props.title.toLowerCase().localeCompare(b.props.title.toLowerCase()))
                                :
                                <p style={{ width: '100%', textAlign: 'center' }}>Il n'y a pas encore de catégories.</p>

                        )
                        :
                        <LoadingIcon src="" className={styles.loadingIcon} width={0} height={0} />
                    }



                </div>

                {/* mise en place du modal */}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="NewCategory Modal"
                    className={styles.Modal}
                    overlayClassName={styles.Overlay}
                    style={customStyles}
                >
                    {<NewCategory closeModal={closeModal} categoryAdded={categoryAdded} />}

                </Modal>


                {/* mise en place du modal subject */}

                <Modal
                    isOpen={modalIsOpen1}
                    onRequestClose={closeModal1}
                    contentLabel="NewSubject Modal"
                    className={styles.Modal}
                    overlayClassName={styles.Overlay}
                    style={customStylesSubject}
                >
                    {<NewSubjects closeModal1={closeModal1} subjectAdded={subjectAdded} />}

                </Modal>


                {/* Modal confirmation de suppression des catégories */}

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
                            <p className={`${styles.deleteTitle} ${styles.warning}`}>Attention: En supprimant la catégorie vous effacerez également les sujets qui lui sont associés. </p>
                            <p className={styles.deleteTitle}>Voulez vous quand même continuer? </p>

                            <div className={styles.deleteBtnContainer}>

                                <button className={`btn newSubject ${styles.deleteBtn}`} onClick={() => deleteCategory(categoryToDelete)}>
                                    Oui
                                </button>

                                <button className={`btn login ${styles.deleteBtn}`} onClick={closeDeleteModal}>
                                    Annuler
                                </button>
                            </div>
                        </div>

                    }
                </Modal>


            </div>
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
        height: '90%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#21274A',
        border: "none",
        borderRadius: "10px"

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

export default HomePage;

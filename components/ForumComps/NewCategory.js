// import styles from '../../styles/Login.module.css';
import styles from '../../styles/NewSubject.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import forbiddenWords from '../../modules/forbiddenWords';



function NewCategory(props) {

    const [category, setCategory] = useState('');

    const config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: forbiddenWords(category) }),
    }

    const createNewCategory = async () => {
        await fetch('https://starchan-backend.vercel.app/categories/newCategories', config);
        setCategory('');
        props.categoryAdded();
    }


    return (
        <div className={styles.container}>
            <div className={styles.xMarkContainer}>
                <FontAwesomeIcon icon={faXmark} className={styles.xMark} onClick={() => props.closeModal()} />
            </div>


            <div className={styles.categorySection}>
                <p className={styles.categoryTitle} >Créer la nouvelle catégorie</p>
                <input className={`input ${styles.categoryText}`} type="text" placeholder="Catégorie" id="category" onChange={e => setCategory(e.target.value)} value={category} maxLength={45} />
                {category.length
                    ?
                    <button className='btn newSubject' id="category" onClick={() => createNewCategory()} value={category}>Créer la catégorie</button>
                    :
                    <button className={`btn ${styles.disabled}`}>Créer la catégorie</button>

                }
            </div>

        </div >
    )
};

export default NewCategory;



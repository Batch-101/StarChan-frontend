import React from 'react'
import styles from '../../styles/News.module.css'


function News(props) {

    {/* La constante handleArticleClick permet lors d'un clique sur un article, 
    il ouvrira un onglet vers l'URL de l'article sélectionner  */}
    const handleArticleClick = (url) => {
        window.open(url, '_blank');
    };

    {/* Les constantes shortTitle & shortDesc limite le nombre de caractères qui peuvent s'afficher sur le prompt 
    pour éviter de saturer la page */}
    const shortTitle = props.title.length > 70 ? props.title.substring(0, 70) + '...' : props.title

    const shortDesc = props.description && props.description.length > 100 ? props.description.substring(0, 100) + '...' : props.description;

    return (
        <div className={styles.articles} onClick={() => handleArticleClick(props.url)}>
            <div className={styles.articleHeader}>
                <h3 className={styles.newsText}>{shortTitle}</h3>
            </div>
            <h4 className={styles.newsText}>- {props.author}</h4>
            {props.urlToImage && (<img src={props.urlToImage} className={styles.img}
                alt={props.title}
                width={225}
                height={150} />)}
            <p>{shortDesc}</p>
        </div>
    )
}

export default News
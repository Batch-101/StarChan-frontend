import { useState, useEffect, useRef } from "react";
import { LoadingIcon } from "../modules/LoadingIcon";
import News from "../components/NewsComps/News";
import styles from '../styles/Actus.module.css';
import Header from "../components/Header";
import Head from "next/head"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from 'react-paginate';

function Actus() {
    const [articlesData, setArticlesData] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const itemsPerPage = 8;

    {/* Hook d'effet pour aller fetch les informations de l'API dans la route news.js du backend.
    La fonction startIndex et endIndex permettent d'afficher le nombre requis d'articles par prompt,
    soit 8 articles. */}
    useEffect(() => {
        fetch(`https://starchan-backend.vercel.app/news`)
            .then(response => response.json())
            .then(articlesDataAPI => {
                const articlesWithImage = articlesDataAPI.articles.filter(e => e.urlToImage);
                setArticlesData(articlesWithImage);
            });
    }, []);

    useEffect(() => {
        // Calcule la fin de la plage d'articles à afficher
        const endOffset = itemOffset + itemsPerPage;

        // Met à jour l'état currentItems avec un sous-ensemble d'articlesData compris entre itemOffset et endOffset
        setCurrentItems(articlesData.slice(itemOffset, endOffset));

        // Calcule le nombre total de pages nécessaires pour afficher tous les articles
        setPageCount(Math.ceil(articlesData.length / itemsPerPage));
    }, [itemOffset, articlesData])



    {/* La constante articlesShown utilise les valeurs insérées dans le hook d'état setArticleData pour schématiser 
    un tableau d'objets qui sont les articles */}
    const articlesShown = currentItems.map((article, index) => (
        <News key={index} {...article} />
    ));

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % articlesData.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };


    return (
        <>
            <Head>
                <title>StarChan - Actus </title>
            </Head>
            <Header />
            <div className={styles.paginationButtons}>
                <ReactPaginate
                    breakLabel="..."
                    previousLabel={<FontAwesomeIcon icon={faArrowLeft} />}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    nextLabel={<FontAwesomeIcon icon={faArrowRight} />}
                    renderOnZeroPageCount={null}
                    activeClassName={styles.activePage}
                />
            </div>

            <div className={styles.articlesContainer}>{articlesShown.slice(0, 4)}</div>
            <div className={styles.articlesContainer}>{articlesShown.slice(4, 8)}</div>

        </>
    );
}

export default Actus;

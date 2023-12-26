import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux';
import News from './News';
import styles from '../../styles/HomeNews.module.css';
import Link from 'next/link';
import TranslateWeather from '../../modules/TranslateWeather';
import FormatWeatherHours from '../../modules/FormatWeatherHours';
import FindWeatherImage from '../../modules/findWeatherImage';
import { LoadingIcon } from '../../modules/LoadingIcon';
import '@vivid-planet/react-image/dist/react-image.css';

function HomeNews() {
    const [articlesData, setArticlesData] = useState([]);
    const [weatherData, setWeatherData] = useState({})
    const [sunData, setSunData] = useState({})
    const articlesContainerRef = useRef(null);
    const router = useRouter();
    const user = useSelector(state => state.user.value);

    {/* Hook d'effet pour aller fetch les informations de l'API dans la route news.js du backend.
    La méthode slice() permet de prendre les quatre premiers articles résultant de la recherche de l'API. */}
    useEffect(() => {
        fetch('https://starchan-backend.vercel.app/news')
            .then(response => response.json())
            .then(articlesDataAPI => {
                {/* La constante articlesWithImages utilise les données résultantes d'articlesDataAPI et filtres les résulats
                en fonction de l'absence ou non d'une image */}
                const articleWithImages = articlesDataAPI.articles.filter(e => e.urlToImage)
                setArticlesData(articleWithImages.slice(0, 4));
            })
    }, []);

    {/* Hook d'effet pour aller fetch les informations de l'API dans la route weather.js du backend. */ }
    useEffect(() => {
        fetch('https://starchan-backend.vercel.app/weather')
            .then(response => response.json())
            .then(weatherDataAPI => {
                setWeatherData(weatherDataAPI)
            })
    }, [])

    {/* Hook d'effet pour aller fetch les informations de l'API dans la route weather.js du backend. */ }
    useEffect(() => {
        fetch('https://starchan-backend.vercel.app/weather/sun')
            .then(response => response.json())
            .then(sunDataAPI => {
                setSunData(sunDataAPI)
            })
    }, [])

    {/* La constante isLogged prend une information précise du hook useSelector pour utiliser le token 
    créer lors de l'inscription. Ce token est dès lors utiliser pour déterminer si l'utilisateur est 
    connecté ou non */}
    const isLogged = user.token != null;

    {/* La constante handleClick permet de naviguer à une page différente à l'aide du router */ }
    const handleClick = () => {
        router.push('/actus')
    }

    {/* La constante blankArticleBlock utilise un bloc de CSS ayant la même dimension que ceux pour les articles,
    excepté que celle-là redirige à la page actus lorsqu'elle est cliquée. Si l'utilisateur n'est pas connecté, 
    il sera redirigé vers la page login */}
    const blankArticleBlock = (

        <Link href={!isLogged
            ? {
                pathname: '/login',
                query: { redirect: 'actus' }
            }
            :
            '/actus'

        } className={styles.articles} onClick={handleClick}>
            <h3>Voir plus...</h3>
        </Link>
    )

    const articles = articlesData.map((data, i) => (
        <News key={i} {...data} />
    ));

    {/* Les constantes weather et sun utilisent la fonctionalité Object pour fonctionnaliser les valeurs
     des objets situés dans les constantes */}
    const weather = Object.values(weatherData)

    const sun = Object.values(sunData)

    {/* La constante weatherTextColor utilise les supports visuels du modules FindWeatherImage pour afficher
    une image en fonction de la météo actuelle */}
    const weatherTextColor = { color: `${FindWeatherImage(weather[0]) == "Clouds" ? "#21274a" : "#fff"}` };

    return (
        <div>
            <h1 className={`title ${styles.homeTitle}`}>Bienvenue sur StarChan</h1>
            <div className={styles.articlesContainer} ref={articlesContainerRef} style={!articles.length ? { alignItems: 'flex-start', justifyContent: 'center' } : {}}>

                {articles.length
                    ?
                    <> {articles} {blankArticleBlock} </>
                    :
                    <LoadingIcon src="" className={styles.loadingIcon} width={0} height={0} />
                }

            </div>
            {weather.length &&
                <div className={styles.weatherWrapper} style={{ backgroundImage: `url("/images/${FindWeatherImage(weather[0])}.jpg")`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                    <h2 className={styles.weatherTitle} style={weatherTextColor}>Localisation : {weather[5]}</h2>
                    <div className={styles.weatherContainer}>
                        <p className={styles.weatherInfos} style={weatherTextColor}>Temps : {TranslateWeather(weather[0])}</p>
                        <p className={styles.weatherInfos} style={weatherTextColor}>Température : {weather[2]}°C</p>
                        <p className={styles.weatherInfos} style={weatherTextColor}>Vent : {weather[3]}km/h</p>
                        <p className={styles.weatherInfos} style={weatherTextColor}>Couverture nuageuse : {weather[4]}%</p>
                    </div>
                    {sun.length &&
                        <>
                            <div className={styles.sunContainer}>
                                <p className={styles.weatherInfos} style={weatherTextColor}>Le soleil se lève à : {FormatWeatherHours(sun[0])} </p>
                                <p className={styles.weatherInfos} style={weatherTextColor}>Le soleil se couche à : {FormatWeatherHours(sun[1])} </p>
                            </div>
                            <div className={styles.weatherContainer}>
                                <p className={styles.weatherInfos} style={weatherTextColor}>Crépuscule astronomique (matin) : {FormatWeatherHours(sun[2])} </p>
                                <p className={styles.weatherInfos} style={weatherTextColor}>Crépuscule astronomique (soir) : {FormatWeatherHours(sun[3])} </p>
                            </div>
                        </>
                    }

                </div>
            }
        </div>
    )

}

export default HomeNews;

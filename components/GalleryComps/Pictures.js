import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import styles from '../../styles/Gallery.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';


function Pictures(props) {

    const pictureID = props.id;
    const starColor = props.starColor;

    return (

        <div className={styles.containerPhoto} >
            <div className={`${styles.faStar} ${starColor.color && styles.starColor}`}>

                {/* au clic sur l'étoile l'image est mise en favoris */}

                <FontAwesomeIcon icon={faStar} onClick={() => props.updateFavoritePictures(pictureID)} />
            </div>
            {props.link && (

                // lorsqu'on clique sur une photo, la fenêtre detailledPicture s'ouvre avec comme lien l'ID de l'image en params

                <Link href={{ pathname: "/detailledPicture", query: { q: pictureID } }}>
                    <Image src={props.link} alt={props.title} width="150" height="150" style={{ marginTop: 20, borderRadius: 10 }} />
                </Link>
            )}
            <h4 className={styles.pictureTitle}>{props.title}</h4>
            <p>Par : {props.user.username}</p>
        </div>

    )
}

export default Pictures
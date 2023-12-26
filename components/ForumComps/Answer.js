import styles from '../../styles/Answer.module.css';
import Image from 'next/image';
import TimeAgo from '../../modules/TimeAgo';
import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';


function Answer(props) {

    const answerID = props._id;
    const username = props.user.username;
    const userID = props.user._id;
    const isAnswerOwnerAdmin = props.user.isAdmin;
    const link = props.user.link;
    const date = props.date;
    const message = props.message;
    const messageImg = props.link;
    const connectedUser = props.connectedUser;
    const isUserAdmin = connectedUser.isAdmin;
    const isSubject = props.isSubject;


    return (

        <div className={styles.answerContainer}>
            <Tooltip id="imgTooltip" style={{ zIndex: 10000, maxWidth: 450, backgroundColor: "#391c4d", opacity: 1, color: "#ebe7c3" }} />

            <div className={styles.answerDetails} style={isSubject ? { backgroundColor: "#542970" } : {}}>
                <div className={styles.profileImg}>
                    <Image src={link} width={100} height={100} style={{ borderRadius: '50%' }} alt="profileImg" />
                </div>

                <p className={styles.username}>{username}</p>
                <p className={styles.role} style={isAnswerOwnerAdmin ? { fontWeight: "bold" } : {}}>{isAnswerOwnerAdmin ? "Admin" : "Membre"}</p>
                <p className={styles.timeAgo}>{TimeAgo(date)}</p>
                {(isUserAdmin || userID === connectedUser._id) &&
                    <>
                        <div className={styles.trashContainer} onClick={() => props.openDeleteModal(answerID)} data-tooltip-id="imgTooltip" data-tooltip-content={isSubject ? "Supprimer le sujet" : "Supprimer la réponse"}  >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </div>
                    </>
                }
            </div>

            <div className={styles.answerTextContainer}>
                {messageImg &&
                    <img src={messageImg} alt="messageImg" className={styles.messageImg} />
                }
                <div className={styles.answerText}>{parse(message)}</div>

            </div>

        </div>
    );
}

export default Answer;
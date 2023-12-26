import styles from '../../styles/Subject.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faEye } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';
import TimeAgo from '../../modules/TimeAgo';


function Subject(props) {

  const { title, answers, subjectID, categoryID } = props;
  let username;
  let profilePicture;
  let date;

  if (answers.length) {
    // Si le sujet a des réponses

    // Récupération de la dernière réponse
    const lastAnswer = answers[answers.length - 1];

    // Attribution des valeurs de la dernière réponse
    username = lastAnswer.user.username;
    profilePicture = lastAnswer.user.link;
    date = lastAnswer.date;
  } else {
    // Si le sujet n'a pas de réponse

    // Attribution des valeurs initiales du sujet
    username = props.username;
    profilePicture = props.profilePicture;
    date = props.date;
  }


  return (
    <div className={styles.container}>
      <Link href={{ pathname: '/subject', query: { q: subjectID, r: categoryID } }}>
        <p className='subjects'>{title}</p>
      </Link>
      <div className={styles.detailsContainer}>

        <div className={styles.iconsContainer}>
          <div className={styles.infos}>
            <p className={styles.counter}>{answers.length}</p>
            <FontAwesomeIcon icon={faCommentDots} className={`icon ${styles.subjectsIcons}`} />
          </div>


        </div>

        <div className='profileImg'>
          <Image src={profilePicture} width={55} height={55} alt="profileImg" />
        </div>

        <div className={styles.textContainer}>
          <p className={styles.text}>{username}</p>
          <p className={styles.text}>{TimeAgo(date)}</p>
        </div>

      </div>
    </div>
  );
}

export default Subject;

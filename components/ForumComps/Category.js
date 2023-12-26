import { useEffect } from 'react';
import styles from '../../styles/Category.module.css';
import Subject from './Subject';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

function Category(props) {


  const matchingSubjects = props.matchingSubjects;
  const searching = props.searching;
  const [subjectsElements, setSubjectsElements] = useState([]);
  const [subjectsLoaded, setSubjectsLoaded] = useState(false);
  const categoryID = props.id;
  const isUserAdmin = props.isUserAdmin;
  useEffect(() => {
    (async () => {
      const response = await fetch(`https://starchan-backend.vercel.app/categories/${categoryID}`);
      const data = await response.json();

      if (data.result) {
        const subjectsIDs = data.categorie.subjects;
        const tmpArr = [];

        /**
 * Récupère les sujets en utilisant les identifiants de sujets fournis.
 * Les composants "Subject" récupérés sont ensuite stockés dans la variable d'état "subjectsElements".
 *
 */
        const getSubjects = async () => {
          let i = 0;

          // Boucle sur chaque identifiant de sujet dans subjectsIDs
          for (const id of subjectsIDs) {
            // Récupération des données du sujet
            const subjectResponse = await fetch(`https://starchan-backend.vercel.app/subjects/${id}`);
            const subjectData = await subjectResponse.json();
            const subject = subjectData.subject;

            if (subject.title) {
              const subjectID = subject._id;
              const title = subject.title;
              const date = subject.date;
              const userID = subject.user._id;
              const answers = subject.answers;

              // Récupération des données de l'utilisateur associé au sujet
              const userResponse = await fetch(`https://starchan-backend.vercel.app/users/${userID}`);
              const userData = await userResponse.json();

              if (userData.result) {

                const username = userData.user.username;
                const profilePicture = userData.user.link;

                const datas = { title, date, username, profilePicture, answers, subjectID, categoryID };

                // Ajout du composant Subject à l'array tmpArr
                if (searching) {
                  for (const el of matchingSubjects) {
                    el._id == id && tmpArr.push(<Subject key={i} {...datas} />);
                  }
                } else {
                  tmpArr.push(<Subject key={i} {...datas} />);
                }

                i++;

              } else {

                const username = "Utilisateur inexistant";
                const profilePicture = "https://res.cloudinary.com/deu4t97ll/image/upload/v1702547761/profile/eqkmw4ax00s1blduv8pr.jpg";
                const datas = { title, date, username, profilePicture, answers, subjectID, categoryID };
                // Ajout du composant Subject à l'array tmpArr
                if (searching) {
                  // Si en mode recherche, vérifie la correspondance avec les sujets de recherche
                  for (const el of matchingSubjects) {
                    // Vérification de correspondance avec l'ID du sujet sur lequel on itère et ajout du composant Subject si vrai
                    el._id == id && tmpArr.push(<Subject key={i} {...datas} />);
                  }
                } else {
                  tmpArr.push(<Subject key={i} {...datas} />);
                }
                // Incrémentation du compteur i (qui est le "key" du composant Subject)
                i++;

              }
            }
          }
        }
        await getSubjects();
        setSubjectsElements(tmpArr);
      } else {
        console.log(data.error)
      }
      setSubjectsLoaded(true)
    })()
  }, [props.isSubjectAdded, props.matchingSubjects, props.searching])



  const preventDisplayEmptyCategories = searching && !subjectsElements.length; // Si on est en train de chercher ET qu'on n'a pas de sujet dans les catégories, on renvoie true

  return (
    subjectsLoaded &&
    <>
      {!preventDisplayEmptyCategories &&
        <div className={styles.container}>

          <div className={styles.header}>
            <h2 className='categories'> {props.title} </h2>

            {isUserAdmin &&

              <>
                <div className={styles.trashContainer} onClick={() => props.openDeleteModal(categoryID)} data-tooltip-id="imgTooltip" data-tooltip-content={"Supprimer la catégorie"} >
                  <FontAwesomeIcon icon={faTrashCan} />
                </div>
                <Tooltip id="imgTooltip" style={{ maxWidth: 450, backgroundColor: "#391c4d", opacity: 1, color: "#ebe7c3" }} />
              </>
            }
          </div>

          <div className={styles.subjectsContainer}>
            {
              subjectsElements.sort((a, b) => {
                // Récupération des dates de création des sujets A et B
                const creationDateSubjectA = a.props.date;
                const creationDateSubjectB = b.props.date;

                if (b.props.answers.length) {
                  // Si le sujet B a des réponses, récupération de la date de la dernière réponse
                  const lastAnswerDateSubjectB = b.props.answers[b.props.answers.length - 1].date;

                  if (a.props.answers.length) {
                    // Si le sujet A a des réponses, récupération de la date de la dernière réponse
                    const lastAnswerDateSubjectA = a.props.answers[a.props.answers.length - 1].date;

                    // Comparaison des dates de dernière réponse pour le tri
                    return new Date(lastAnswerDateSubjectB) - new Date(lastAnswerDateSubjectA);
                  } else {
                    // Si le sujet A n'a pas de réponse, comparaison avec sa date de création
                    return new Date(lastAnswerDateSubjectB) - new Date(creationDateSubjectA);
                  }
                } else {
                  // Si le sujet B n'a pas de réponse
                  if (a.props.answers.length) {
                    // Si le sujet A a des réponses, récupération de la date de la dernière réponse
                    const lastAnswerDateSubjectA = a.props.answers[a.props.answers.length - 1].date;

                    // Comparaison avec la date de création du sujet B
                    return new Date(creationDateSubjectB) - new Date(lastAnswerDateSubjectA);
                  } else {
                    // Si le sujet A et le sujet B n'ont pas de réponse, comparaison des dates de création
                    return new Date(creationDateSubjectB) - new Date(creationDateSubjectA);
                  }
                }
              })
            }
          </div>

        </div>
      }
    </>
  );
}

export default Category;

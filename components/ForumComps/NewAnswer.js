import styles from '../../styles/NewAnswer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Files from 'react-files';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { useSelector } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import forbiddenWords from '../../modules/forbiddenWords';

function newAnswer(props) {

    const [message, setMessage] = useState('');
    const [imgFile, setImgFile] = useState('');

    const subjectID = props.subjectID;
    const username = props.username;
    const email = useSelector(state => state.user.value.email);
    const token = email.token;
    const validMessage = message.length > 0


    const tooltipStr = `Cliquez ou glissez votre image (formats autorisés: .png, .jpg, .jpeg, max 10Mo) Celle-ci apparaîtra au début de votre réponse`;

    {/* La constante uploadImage permet de téléverser des images à la route backend pictures */ }
    const uploadImage = async () => {

        const formData = new FormData()

        formData.append('image', imgFile)

        const response = await fetch('https://starchan-backend.vercel.app/pictures/uploadToForum', { method: 'POST', body: formData })
        const data = await response.json();

        return data.url;

    }

    {/* Permet de créer une nouvelle réponse en faisant un fetch vers la route subjects en faisant une opération CRUD pour post 
    une nouvelle réponse */ }
    const createNewAnswer = async () => {

        let link = "";

        if (imgFile.id) {
            link = await uploadImage();
        }

        {/* Les const scriptRegex et checkedMessage spnt des mesures de sécurité pour empêcher l'exécution de scripts dans les messages fournis par l'utilisateur.
        Si le message contient des balises <script>, il remplace le message par un avertissement ; 
        sinon, il coupe le message. Ceci est souvent utilisé pour atténuer le risque d’attaques de scripts intersites (XSS)
        en filtrant ou en rejetant le contenu de script potentiellement dangereux. */}
        const scriptRegex = /<\s*script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/;
        const checkedMessage = scriptRegex.test(message) ? "Les scripts ne sont pas autorisés" : message.trim();

        const config = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                message: forbiddenWords(checkedMessage), //Utilise le module forbiddenWords pour censurer les mots interdits 
                subjectID,
                email,
                link,
                token
            })
        }

        const answerResponse = await fetch('https://starchan-backend.vercel.app/subjects/newAnswer', config);
        const answerData = await answerResponse.json();

        answerData.result && props.answerAdded();

    }

    const handleChange = (files) => {
        setImgFile(files[0]); //Permet d'insérer une image dans la réponse
    }

    const handleError = (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message) //Permet de gérer les erreurs
    }

    return (
        <div className={styles.container}>
            <div className={styles.xMarkContainer}>
                <FontAwesomeIcon icon={faXmark} className={styles.xMark} onClick={() => props.closeModal()} />
            </div>
            <p className={styles.titleSubject} >Créer une nouvelle réponse</p>
            <div className={styles.textSubject}>
                <Editor
                    onEditorChange={(newValue, editor) => setMessage(newValue)}
                    value={message}
                    apiKey={"85eefcre8csp98zy4bi3xrg07j73gf6548z11er6gs1bp2rl"}
                    initialValue=""
                    init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                        ],
                        toolbar:
                            "undo redo | blocks | " +
                            "bold italic forecolor | alignleft aligncenter " +
                            "alignright alignjustify | bullist numlist outdent indent | " +
                            "removeformat | help",
                        content_style:
                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                />
            </div>
            <div className={styles.formSubject}>
                <Files
                    className={styles.answerImg}
                    onChange={handleChange}
                    onError={handleError}
                    accepts={['image/png', 'image/jpg', 'image/jpeg']}
                    maxFileSize={10000000}
                    minFileSize={0}
                    clickable>
                    {imgFile
                        ?
                        <img data-tooltip-id="imgTooltip" data-tooltip-content={tooltipStr} src={imgFile.preview.url ? imgFile.preview.url : ''} alt="Insérer une image" />
                        :
                        <p data-tooltip-id="imgTooltip" data-tooltip-content={tooltipStr} className={styles.insertImg}>Insérer une image</p>
                    }
                </Files>
                <Tooltip id="imgTooltip" style={{ backgroundColor: "#21274A", color: "#ebe7c3" }} />
                {validMessage
                    ?
                    <button className='btn newSubject' id="subject" onClick={() => createNewAnswer()}>Répondre</button>
                    :
                    <button className={`btn ${styles.disabled}`} id="subject">Répondre</button>
                }
            </div>

        </div>
    )
}

export default newAnswer;
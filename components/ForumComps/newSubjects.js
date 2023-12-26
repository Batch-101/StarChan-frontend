import styles from '../../styles/NewSubject.module.css';
import Select from 'react-select'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Editor } from "@tinymce/tinymce-react";
import Files from 'react-files';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import forbiddenWords from '../../modules/forbiddenWords';



function NewSubjects(props) {

    const user = useSelector(state => state.user.value)
    const email = user.email;
    const token = user.token;

    const [selectedCategorie, setSelectedCategorie] = useState({});
    const [categories, setCategories] = useState([]);
    const [subjectTitle, setSubjectTitle] = useState('');
    const [message, setMessage] = useState('');
    const [imgFile, setImgFile] = useState('');

    const isTitleValid = subjectTitle.length > 0;
    const isMessageValid = message.length > 0;
    const isCategoryValid = selectedCategorie.value;

    const isFormValid = isTitleValid && isMessageValid && isCategoryValid;

    const tooltipStr = `Cliquez ou glissez votre image (formats autorisés: .png, .jpg, .jpeg, max 10Mo) Celle-ci apparaîtra au début de votre message`;

    useEffect(() => {
        fetch('https://starchan-backend.vercel.app/categories')
            .then(response => response.json())
            .then(categoriestitle => {

                const options = categoriestitle.categories.map(categorie => {
                    return (
                        { value: categorie.title, label: categorie.title }
                    )
                })

                setCategories(options);
            });
    }, []);

    const uploadImage = async () => {

        const formData = new FormData()

        formData.append('image', imgFile)

        const response = await fetch('https://starchan-backend.vercel.app/pictures/uploadToForum', { method: 'POST', body: formData })
        const data = await response.json();

        return data.url;

    }

    const createNewSubject = async () => {

        let link = "";

        if (imgFile.id) {
            link = await uploadImage();
        }

        const scriptRegex = /<\s*script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/;
        const checkedMessage = scriptRegex.test(message) ? "Les scripts ne sont pas autorisés" : message.trim();

        const config = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subjectTitle: forbiddenWords(subjectTitle),
                categoryName: selectedCategorie.value,
                message: forbiddenWords(checkedMessage),
                link,
                token,
                email
            }),
        };

        const subjectResponse = await fetch('https://starchan-backend.vercel.app/subjects/newSubjects', config);
        const subjectData = await subjectResponse.json();

        subjectData.result && props.subjectAdded();

    };



    const handleChange = (files) => {
        setImgFile(files[0]);
    };



    const handleError = (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message)
    };


    return (
        <div className={styles.container}>
            <div className={styles.xMarkContainer}>
                <FontAwesomeIcon icon={faXmark} className={styles.xMark} onClick={() => props.closeModal1()} />
            </div>

            <p className={styles.titleSubject} >Créer un nouveau sujet</p>

            <div className={styles.inputContainer}>
                <div className={styles.identifySubject}>
                    <Select options={categories} onChange={(e) => setSelectedCategorie(e)} value={selectedCategorie} />
                </div>

                {!isCategoryValid &&
                    <p className={styles.warning} style={{ marginBottom: 0 }}>Veuillez choisir une catégorie</p>
                }
            </div>
            <div className={styles.inputContainer}>
                <input className={`input ${styles.inputText}`} onChange={(e) => setSubjectTitle(e.target.value)} value={subjectTitle} type="text" placeholder="Titre" />
                {!isTitleValid &&
                    <p className={styles.warning} style={{ marginBottom: 0 }}>Veuillez remplir ce champ</p>
                }
            </div>



            <div className={styles.formSubject}>

                <Editor
                    onEditorChange={(newValue, editor) => setMessage(newValue)}
                    value={message}
                    apiKey={"9xb3tr7880lmbsherfxfjqyxp911gprdervklx0qi9dsflws"}
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
                <div className={styles.textSubject}>
                    {!isMessageValid &&
                        <p className={`${styles.warning} ${styles.editorWarning}`} style={{ marginBottom: 0 }}>Veuillez remplir ce champ</p>
                    }
                </div>
            </div>

            <div className={styles.bottomContainer}>

                <div className={styles.imgContainer}>
                    <Files
                        className={styles.subjectImg}
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
                    <Tooltip id="imgTooltip" style={{ maxWidth: 450, backgroundColor: "#391c4d", opacity: 1, color: "#ebe7c3" }} />

                </div>
                <div>
                    {isFormValid
                        ?
                        <button className={'btn newSubject'} style={{ fontWeight: 'bold' }} id="subject" onClick={() => createNewSubject()}>Créer le sujet</button>
                        :
                        <button className={`btn ${styles.disabled}`}>Créer le sujet</button>
                    }
                </div>

            </div>

        </div >
    )
}



export default NewSubjects;
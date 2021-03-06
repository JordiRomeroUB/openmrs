import React, {useEffect, useState} from 'react'
import {Grid, Typography} from "@material-ui/core";
import AppFrame from "../components/AppFrame";
import DataTable from "../components/DataTable";
import {useLocation} from "react-router-dom";

import {headTable} from "../data/reports";
import axios from "axios";
import {accesToken} from "../constants/token";

const DataPage = () => {

    axios.interceptors.request.use(
        config => {
            config.headers.authorization = `Bearer ${accesToken}`;
            return config
        },
        error => {
            return Promise.reject(error)
        }
    )

    const [data, setData] = useState([])

    const apiUrl = '/api'
    const [questionsData, setQuestionsData] = useState([]);
    const [studyData, setStudyData] = useState([]);
    const [formData, setFormData] = useState([]);

    const location = useLocation();
    let path_array = location.pathname.split("/");
    let studyId = path_array[path_array.length - 3]
    let formId = path_array[path_array.length - 1]
    const tabs = [
        {
            labelTab: studyData.title,
            linkTab: "/study/" + studyId + "/forms",
        },
        {
            labelTab: "Home",
            linkTab: "/",
        },
        {
            labelTab: "Forms",
            linkTab: "/study/" + studyId + "/forms",
        },
        {
            labelTab: "Participants",
            linkTab: "/study/" + studyId + "/participants",
        }
    ];

    const authAxios = axios.create({
        baseURL: apiUrl,
        headers: {
            Authorization: `Bearer ${accesToken}`
        }
    })

    const getQuestions = async () => {
        try {
            await authAxios.get(`forms/${formId}/questions`).then(result => {
                setQuestionsData(result.data)
            });
        } catch (err) {
            setQuestionsData(err.message)
        }
    }

    const getStudy = async () => {
        try {
            const result = await authAxios.get(`/studies/${studyId}`);
            setStudyData(result.data)
        } catch (err) {
            setStudyData(err.message)
        }
    }

    const getForm = async () => {
        try {
            const result = await authAxios.get(`/forms/${formId}/`);
            setFormData(result.data)
        } catch (err) {
            setFormData(err.message)
        }
    }


    useEffect(() => {
        getQuestions()
        getStudy()
        getForm()

    }, []);

    useEffect(() => {
        if (questionsData != null) {
            createTable()
        }
    }, [questionsData])

    const createTable = () => {
        var dict = []; // create an empty array
        questionsData.map((item) => {
            dict.push({
                id: item["id"],
                col1: item["question"],
                col2: item["subtitle"],
                col3: item["info"],
                col4: item["fieldType"],
                col5: item["mandatory"],
                col6: item["variableName"],
                col7: item["conditional"],
                col8: item["creationDate"],
                col9: item["editDate"],
                col10: item["actions"]
            });

        })
        setData(dict);
    }

    return (

        <AppFrame tabs={tabs}>

            <Grid item style={{marginTop: "5em"}}>
                <Grid container item direction={"column"} style={{marginBottom: "2em", padding: "10px"}}>
                    <Typography variant={"h3"} align={"center"}>{formData.title +" "}
                        de {studyData.title}</Typography>
                    <Typography variant={"subtitle1"} align={"center"}>{formData.description}</Typography>
                </Grid>
            </Grid>
            <Grid container
                  direction={"column"}
                  justify="center"
                  style={{margin: "2em", padding: "10px"}}>
                <Grid item>
                    <DataTable rows={data} columns={headTable}/>
                </Grid>
            </Grid>
        </AppFrame>
    )
}

export default DataPage
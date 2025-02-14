import React , { createContext, useState } from "react";

const StudentContext = createContext() ;

export const StudentProvider = ({children})=> {

    const [StudentDeatils , setStudentDetails] = useState({})


    return(
        <StudentContext.Provider value={{}}>
            {children}
        </StudentContext.Provider>
    )

}

export default StudentContext
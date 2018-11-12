import * as H from "history";
import {match} from "react-router";

export interface IProps {
    history: H.History;
    location: H.Location<any>;
    match: match<any>;
};

/* Internal state. Usually left empty except for forms and other small exceptions */
export interface IState {
    fields: IFields;
    errors: IErrors;
    showPassword: boolean;
    isNew: boolean;
    isEditing: boolean;
    isFetching: boolean;
    isDeleting: boolean;
    isCreating: boolean;
    redirect?: string;
    course?: ICourse;
    isDeleteModalOpen: boolean;
    allSubjects: ISubject[],
    allProfesors: IProfessor[],
}

export interface IFields {
    subject: ISubject;
    startDate: string;
    endDate: string;
    id: string;
    requiredSubjects: string[];
    courseProfessors: string[];
    originalCourseProfessors: string[];
}

export type IErrors = {
    [p in keyof IFields]?: boolean
};

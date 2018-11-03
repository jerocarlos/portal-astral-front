import * as React from 'react';
import { IErrors, IProps, IState } from './types';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Typography,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog/DeleteConfirmationDialog";
import { Redirect, withRouter } from "react-router";
import { createStudent, deleteStudent, getStudentById, updateStudent } from "../../utils/api";
import session from "../../utils/session";
import {DateTime} from "luxon";
import {validateBirthdayDate} from "../../utils/validation";

const styles = require('./StudentForm.pcss');

class StudentForm extends React.Component<IProps, IState> {


  state: IState = {
    fields: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      file: '',
      id: '',
      identificationType: '',
      birthday: '',
      identification: '',
      address: '',
    },
    careers: [],
    showPassword: false,
    errors: {},
    isNew: true,
    isEditing: true,
    isFetching: false,
    isCreating: false,
    isDeleting: false,
    isDeleteModalOpen: false,
  };


  componentDidMount() {
    const { match } = this.props;

    if (match.params.id) {
      getStudentById(match.params.id).then(this.handleResponse).then(this.setStudent).catch(this.redirect);
      this.setState({ isNew: false, isFetching: true });
    } else {
      this.setState({ isNew: true });
    }

    this.fetchCareers();
  }

  redirect = () => {
    this.setState({ redirect: '/students' });
  };

  fetchCareers = () => {
    // TODO implement when careers is implemented
  };

  handleResponse = (response: Response): Promise<IStudent> => {
    if (response.status === 404) {
      throw Error('Student not found');
    }

    return response.json();
  };

  setStudent = (student: IStudent) => {
    this.setState({ student, isNew: false, isEditing: false, isFetching: false }, this.mapStudent);
  };

  mapStudent = () => {
    const { student } = this.state;

    if (!student) {
      return;
    }

    const { email, name, lastName, id, password, file, birthday, career, address, identification, identificationType } = student;
    this.setState({
      ...this.state,
      fields: {
        ...this.state.fields,
        email,
        name,
        id,
        lastName,
        password,
        file,
        address,
        birthday,
        career,
        identificationType,
        identification,
      },
    });
  };

  handleChange = (prop: string) => (event: any) => {

      let value = event.target.value;

      if (prop == 'birthday'){
          let date = DateTime.fromFormat(value, "yyyy-MM-dd");
          value = date.isValid ? date.toFormat("dd/MM/yyyy") : value;
      }

    this.setState({
      ...this.state,
      fields: {
        ...this.state.fields,
        [prop]: value,
      },
    });
  };

  handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState((state: any) => ({ showPassword: !state.showPassword }));
  };

  handleSubmit = () => {
    if (this.validateAll()) {
      if (!this.state.isNew) {
        updateStudent(this.state.fields).then(() => this.setState({ redirect: '/students' }));
      }
      else {
        createStudent(this.state.fields).then(() => this.setState({ redirect: '/students' }));
      }
    }
  };

  validateAll = () => {
    const errors: IErrors = {};

    /* Validate all fields and set errors */
    const results: boolean[] = Object.keys(this.state.fields).map((field) => {
      const isValid = this.validate(field, this.state.fields[field]);
      errors[field] = !isValid;
      return isValid;
    });
    const reduce = results.reduce(this.checkBooleans, true);
    /* Update error state */
    this.setState({
      ...this.state,
      errors: errors,
    });
    return reduce;
  };

  checkBooleans = (acc: boolean, elem: boolean) => {
    return acc && elem
  };

  validate = (field: string, value: any): boolean => {
    switch (field) {
      case 'name':
        return (
          this.validatename(value)
        );
      case 'lastName':
        return (
          this.validateLastName(value)
        );
      case 'email':
        return (
          this.validateEmail(value)
        );
      case 'password':
        return (
          this.validatePassword(value)
        );
        case 'birthday':
            return validateBirthdayDate(DateTime.local())(DateTime.fromFormat(value, "dd/MM/yyyy"));
      default:
        return true;
    }
  };

  validatename = (value: any): boolean => {
    return value !== '';
  };

  validateLastName = (value: any): boolean => {
    return value !== '';
  };

  validateEmail = (value: any): boolean => {
    return value !== '' && value.includes('@');
  };

  validatePassword = (value: any): boolean => {
    return !!(value != "" && value.length >= 6 && value.length < 20 && this.checkLetters(value));
  };

  checkLetters = (value: string): boolean => {
    const words = value.match("[A-z]+");
    const numbers = value.match("[0-9]+");
    return words != undefined && words.length > 0 && numbers != undefined && numbers.length > 0;
  };

  areInputsReadOnly = () => {
    const { isEditing } = this.state;
    return !isEditing;
  };

  handleEdit = () => {
    this.setState({ ...this.state, isEditing: true });
  };

  handleCancel = () => {
    if (this.state.isNew) {
      this.setState({ redirect: '/students' });
    } else {
      this.setState({ isEditing: false }, this.mapStudent);
    }
  };

  getHeader = () => {
    if (this.state.isNew) {
      return 'Create student';
    } else {
      return 'Edit student';
    }
  };

  handleDeleteClick = () => {
    // this.props.onClickDelete(this.props.student as IStudent);
    this.setState({ isDeleteModalOpen: true });
  };

  handleCloseDelete = () => {
    // this.props.onCloseDelete();
    this.setState({ isDeleteModalOpen: false });
  };

  handleConfirmDelete = () => {
    // this.props.onConfirmDelete(this.props.student as IStudent).then(() => this.props.history.push('/students'));
    const student = this.state.student;

    if (!student) {
      return;
    }

    deleteStudent(student.id).then(() => this.setState({ redirect: '/students' }));
  };

  renderTitle = () => {
    const { isNew } = this.state;
    const { name, lastName } = this.state.fields;
    return <div>
      {
        !isNew &&
        <div className={styles.deleteButtonDiv}>
          <Button
            variant='contained'
            color='secondary'
            onClick={this.handleDeleteClick}
          >
            DELETE
          </Button>
        </div>
      }
      <div className={styles.displayNameDiv}>{`${name} ${lastName}`}</div>
    </div>
  };

  render() {
    const { fields, showPassword, errors, isFetching, isDeleteModalOpen, isDeleting, isCreating, redirect } = this.state;

    const userType = session.getUserType();

      if (fields.birthday) {
          let date = DateTime.fromFormat(fields.birthday, "d/M/y");
          fields.birthday = date.isValid? date.toISODate() : fields.birthday;
      }

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    if (userType !== 'Admin') {
      return <Redirect to={'/students'} />;
    }

    if (isFetching || isDeleting || isCreating) {
      return <div><CircularProgress /></div>
    }

    const readOnly = this.areInputsReadOnly();

    return (
      <div className={styles.NewStudent}>

        {
          isDeleteModalOpen &&
          <DeleteConfirmationDialog
            isLoading={isDeleting}
            userType={'student'}
            name={`${fields.name} ${fields.lastName}`}
            handleCloseDelete={this.handleCloseDelete}
            handleConfirmDelete={this.handleConfirmDelete}
          />
        }

        <Typography className={styles['New-Student-title']} color='textSecondary'>
          {
            this.getHeader()
          }
        </Typography>
        <Card className={styles['New-Student-box']}>
          <CardHeader title={this.renderTitle()} className={styles.displayName} />
          <CardContent>
            <form className={styles['New-Student-form']}>
              <FormControl className={styles['student-form-control']} error={errors.name}>
                <InputLabel required htmlFor='student-name'>First name</InputLabel>
                <Input id='student-name'
                       value={fields.name}
                       onChange={this.handleChange('name')}
                       readOnly={readOnly}
                />
              </FormControl>
              <FormControl className={styles['student-form-control']} error={errors.lastName}>
                <InputLabel required htmlFor='student-surname'>Last name</InputLabel>
                <Input id='student-surname'
                       value={fields.lastName}
                       onChange={this.handleChange('lastName')}
                       readOnly={readOnly}
                />
              </FormControl>
              <FormControl className={styles['student-form-control']} error={errors.email}>
                <InputLabel required htmlFor='student-email'>E-mail</InputLabel>
                <Input id='student-email'
                       value={fields.email}
                       onChange={this.handleChange('email')}
                       readOnly={readOnly}
                />
              </FormControl>
              <FormControl className={styles['student-form-control']} error={errors.file}>
                <InputLabel required htmlFor='student-file'>File</InputLabel>
                <Input id='student-file'
                       value={fields.file}
                       onChange={this.handleChange('file')}
                       readOnly={readOnly}
                />
              </FormControl>
              <FormControl className={styles['student-form-control']} error={errors.identification}>
                <InputLabel required htmlFor='student-identification'>Identification</InputLabel>
                <Input id='student-identification'
                       value={fields.identification}
                       onChange={this.handleChange('identification')}
                       readOnly={readOnly}
                />
              </FormControl>
              <FormControl className={styles['student-form-control']} error={errors.identificationType}>
                <InputLabel required htmlFor='student-identificationType'>Identification type</InputLabel>
                <Input id='student-identificationType'
                       value={fields.identificationType}
                       onChange={this.handleChange('identificationType')}
                       readOnly={readOnly}
                />
              </FormControl>
              <FormControl className={styles['student-form-control']} error={errors.birthday}>
                <InputLabel required htmlFor='student-birthday' shrink>Birthday</InputLabel>
                <Input id='student-birthday'
                       value={fields.birthday}
                       onChange={this.handleChange('birthday')}
                       readOnly={readOnly}
                       type={'date'}
                />
              </FormControl>
              <FormControl className={styles['student-form-control']} error={errors.address}>
                <InputLabel required htmlFor='student-address' shrink>Address</InputLabel>
                <Input id='student-address'
                       value={fields.address}
                       onChange={this.handleChange('address')}
                       readOnly={readOnly}
                />
              </FormControl>
              {/* TODO uncomment when careers is implemented */}
              {/*<FormControl className={styles['student-form-control']} error={errors.career}>
                <InputLabel required htmlFor='student-career' shrink>Career</InputLabel>
                <Select id='student-career'
                        value={fields.career ? fields.career.id : ''}
                        onChange={this.handleChange('career')}
                        readOnly={readOnly}
                >

                </Select>
              </FormControl>*/}
              <FormControl className={styles['student-form-control']} error={errors.password}>
                <InputLabel required htmlFor='adornment-password'>Password</InputLabel>
                <Input
                  id='adornment-password'
                  type={showPassword ? 'text' : 'password'}
                  value={this.state.isEditing ? fields.password : ""}
                  onChange={this.handleChange('password')}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='Toggle password visibility'
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  readOnly={readOnly}
                />
                <FormHelperText className={styles['password-helper-text']} id='password-helper-text'>
                  Must be between 6 and 20 characters with at least one number and one letter
                </FormHelperText>
              </FormControl>
            </form>
          </CardContent>

          <CardActions>
            <div className={styles.buttonContainer}>
              {
                readOnly
                  ? <Button
                    variant='contained'
                    color='primary'
                    className={styles['create-student-button']}
                    onClick={this.handleEdit}
                  >
                    EDIT
                  </Button>
                  : <div className={styles.submitCancelButtons}>
                    <Button
                      variant='outlined'
                      className={styles['create-student-button']}
                      onClick={this.handleCancel}
                    >
                      CANCEL
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      className={styles['create-student-button']}
                      onClick={this.handleSubmit}
                    >
                      SAVE
                    </Button>
                  </div>
              }
            </div>
          </CardActions>

        </Card>

      </div>
    );
  }
}

export default withRouter(StudentForm);

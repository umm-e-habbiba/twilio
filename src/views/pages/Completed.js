import React, { useState, useEffect } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardHeader,
  CCardTitle,
  CCardBody,
  CButton,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { API_URL } from '../../store'
import { useForm } from 'react-hook-form'
import moment from 'moment'
const Completed = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [loader, setLoader] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [allUsers, setallUsers] = useState([])
  const [userId, setUserId] = useState('')
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [addModal, setAddModal] = useState(false)
  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      getAllUsers()
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      status: '',
    },
  })
  const getAllUsers = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'users', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.success) {
          setallUsers(result.Users?.filter((user) => user.status == 'Answered'))
          setLoader(false)
        }
      })
      .catch((error) => console.error(error))
  }
  const addUser = (data) => {
    console.log('adduser function called', data)
    setSpinner(true)
    setError(false)
    setErrorMsg('')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      phone: data.phone,
      status: data.status,
    })

    const requestOptions = {
      method: 'POST',
      body: raw,
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'add-user', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        if (result.success) {
          setAddModal(false)
          setSpinner(false)
          getAllUsers()
          reset({})
          setSuccess(true)
          setSuccessMsg(result.message)
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setError(true)
          setErrorMsg(result.message)
          setSpinner(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setSpinner(false)
      })
  }
  return (
    <DefaultLayout>
      <CCard className="mb-3">
        <CCardHeader className="flex justify-between items-center">
          <span>Completed ({allUsers.length})</span>
          {/* <CButton
            color="success"
            className="text-white"
            onClick={() => {
              setAddModal(true)
              setError(false)
              setErrorMsg('')
            }}
          >
            Add User
          </CButton> */}
        </CCardHeader>
        <CCardBody>
          {loader ? (
            <center className="mt-4">
              <CSpinner color="primary" variant="grow" />
            </center>
          ) : (
            <>
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col" className="text-center">
                      #
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center">
                      Number
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center">
                      Date
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center">
                      Time
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center">
                      Status
                    </CTableHeaderCell>
                    {/* <CTableHeaderCell scope="col">Actions</CTableHeaderCell> */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {allUsers && allUsers.length > 0 ? (
                    allUsers.map((user, i) => (
                      <CTableRow key={i}>
                        <CTableDataCell scope="row" className="text-center">
                          {i + 1}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{user.phone}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {moment(user.date).format('Do MMMM YYYY')}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {moment(user.date).format('h:mm a')}
                        </CTableDataCell>
                        <CTableDataCell className="flex justify-center items-center">
                          <CBadge color="success" className="w-4 h-4 rounded-full mr-1">
                            {' '}
                          </CBadge>
                          <span>{user.status}</span>
                        </CTableDataCell>
                        {/* <CTableDataCell>
                          <CButton
                            color="danger"
                            className="text-white py-2 my-2"
                            onClick={(e) => {
                              setDeleteModal(true)
                              setSmsId(x._id)
                              setError(false)
                              setErrorMsg('')
                            }}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTableDataCell> */}
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={5} className="text-center">
                        No Completed Users
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </>
          )}
        </CCardBody>
      </CCard>
      {/* add modal */}
      <CModal
        alignment="center"
        visible={addModal}
        onClose={() => setAddModal(false)}
        aria-labelledby="VerticallyCenteredExample"
        size="lg"
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">Add User</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit(addUser)}>
          <CModalBody>
            <CForm>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel>Phone</CFormLabel>
                  <CRow>
                    <CCol md={12}>
                      <CFormInput
                        placeholder="Phone Number"
                        type="number"
                        {...register('phone', { required: true })}
                        feedback="Phone number is required"
                        invalid={errors.phone ? true : false}
                        className="mb-2"
                      />
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormSelect
                    label="Status"
                    aria-label="status"
                    id="status"
                    defaultValue={getValues('status')}
                    options={[
                      { label: 'Select Status', value: '' },
                      { label: 'Pending', value: 'Pending' },
                      { label: 'Answered', value: 'Answered' },
                      { label: 'Failed', value: 'Failed' },
                    ]}
                    {...register('status', { required: true })}
                    feedback="Status is required"
                    invalid={errors.status ? true : false}
                  />
                </CCol>
              </CRow>
            </CForm>
            {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setAddModal(false)}>
              Close
            </CButton>
            <CButton color="primary" type="submit" disabled={spinner ? true : false}>
              {spinner ? <CSpinner color="light" size="sm" /> : 'Add'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
      {/* success alert */}
      {success && (
        <CAlert color="success" className="success-alert">
          {successMsg}
        </CAlert>
      )}
    </DefaultLayout>
  )
}
export default Completed

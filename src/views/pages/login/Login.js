import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { API_URL } from '../../../store'
import { useForm } from 'react-hook-form'
const Login = () => {
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState(false)
  const [loginErrorValue, setLoginErrorValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      navigate('/')
    }
  }, [])

  const login = (data) => {
    setLoginError(false)
    setLoginErrorValue('')
    setIsLoading(true)
    // console.log(data)
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      email: data.email,
      password: data.password,
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(API_URL + 'admin-login', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setIsLoading(false)
        if (result.token) {
          localStorage.setItem('token', result.token)
          if (result.message === 'Login successful as admin') {
            localStorage.setItem('user', 'admin')
            setSuccess(true)
            setTimeout(() => {
              setSuccess(false)
              navigate('/')
            }, 2000)
          }
        }
        if (result.error) {
          setLoginError(true)
          setLoginErrorValue(result.message)
          // }
        }
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
      })
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(login)}>
                    <h1 className="text-center mb-2 text-2xl">Login</h1>
                    <p className="text-body-secondary text-center mb-3">Sign In to your account</p>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        {...register('email', { required: true })}
                        feedback="Please enter your email."
                        invalid={errors.email ? true : false}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        {...register('password', { required: true, minLength: 8 })}
                        feedback="Please enter valid password and passowrd must contain atleast 8 characters."
                        invalid={errors.password ? true : false}
                      />
                    </CInputGroup>
                    <div className="mt-2 mb-4">
                      {loginError && <span className="text-red-400 my-3">{loginErrorValue}</span>}
                    </div>
                    <CRow>
                      <CCol xs={12} lg={12}>
                        <CButton color="primary" type="submit" className="px-4 w-full">
                          {isLoading ? <CSpinner color="light" size="sm" /> : 'Login'}
                        </CButton>
                      </CCol>
                    </CRow>
                    {/* <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow> */}
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      {success && (
        <CAlert color="success" className="success-alert uppercase">
          Login successful!
        </CAlert>
      )}
    </div>
  )
}

export default Login

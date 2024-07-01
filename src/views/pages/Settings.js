import React, { useState, useEffect } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
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
} from '@coreui/react'
import { API_URL } from '../../../src/store'
import CIcon from '@coreui/icons-react'
import { cilMinus, cilPen, cilPhone, cilPlus, cilTrash } from '@coreui/icons'
import moment from 'moment'

const Settings = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [callLoading, setCallLoading] = useState(false)
  const [smsLoading, setSmsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [textMessage, setTextMessage] = useState('')
  const [textMessageError, setTextMessageError] = useState('')
  const [callNumber, setCallNumber] = useState(0)
  const [callNumberError, setCallNumberError] = useState('')
  const [smsSettings, setSmsSettings] = useState([])
  const [callSettings, setCallSettings] = useState([])
  const [callSuccess, setCallSuccess] = useState(false)
  const [smsSuccess, setSmsSuccess] = useState(false)
  const [viewModal, setViewModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteLoader, setDeleteLoader] = useState(false)
  const [SmsId, setSmsId] = useState('')
  const [showSaveBtn, setshowSaveBtn] = useState(false)
  const [callError, setCallError] = useState(false)
  const [callErrorMsg, setCallErrorMSg] = useState('')
  const [viewMessage, setViewMessage] = useState('')

  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      getCallSettings()
      getSMSSettings()
    } else {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    console.log('call number', callNumber)
  }, [callNumber])

  const addCallSetting = () => {
    setError(false)
    setErrorMsg('')
    setCallNumberError('')
    setCallLoading(true)
    if (callNumber != '') {
      const myHeaders = new Headers()
      myHeaders.append('Authorization', token)
      myHeaders.append('Content-Type', 'application/json')

      const raw = JSON.stringify({
        numberOfCallsPerHour: callNumber,
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      }

      fetch(API_URL + 'api/add-call', requestOptions)
        .then((response) => response.json())
        .then((result) => {
          // console.log(result)
          setCallLoading(false)
          if (result.success) {
            setSuccess(true)
            setSuccessMsg('Setting added successfully')
            getCallSettings()
            setTimeout(() => {
              setSuccess(false)
              setSuccessMsg('')
            }, 3000)
          } else {
            setCallNumberError(result.message)
          }
        })
        .catch((error) => {
          console.error(error)
          setCallLoading(false)
        })
    } else {
      setCallNumberError('Number of calls field is required')
      setCallLoading(false)
    }
  }
  const addSMSSetting = () => {
    setError(false)
    setErrorMsg('')
    setTextMessageError('')
    setSmsLoading(true)
    if (textMessage != '') {
      const myHeaders = new Headers()
      myHeaders.append('Authorization', token)
      myHeaders.append('Content-Type', 'application/json')

      const raw = JSON.stringify({
        textMessage: textMessage,
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      }

      fetch(API_URL + 'api/add-sms', requestOptions)
        .then((response) => response.json())
        .then((result) => {
          // console.log(result)
          setSmsLoading(false)
          if (result.success) {
            setSuccess(true)
            setTextMessage('')
            setSuccessMsg('Setting added successfully')
            getSMSSettings()
            setTimeout(() => {
              setSuccess(false)
              setSuccessMsg('')
            }, 3000)
          } else {
            setTextMessageError(result.message)
          }
        })
        .catch((error) => {
          console.error(error)
          setSmsLoading(false)
        })
    } else {
      setTextMessageError('Message field is required')
      setSmsLoading(false)
    }
  }
  const getCallSettings = () => {
    setCallSuccess(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'api/call', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.success) {
          setCallSettings(result.Settings)
          setCallNumber(result.Settings[0].numberOfCallsPerHour)
          setCallSuccess(false)
        }
      })
      .catch((error) => console.error(error))
  }
  const getSMSSettings = () => {
    setSmsSuccess(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'api/sms', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.success) {
          setSmsSettings(result.Settings)
          setSmsSuccess(false)
        }
      })
      .catch((error) => console.error(error))
  }
  const deleteSms = () => {
    setDeleteLoader(true)
    setError(false)
    setErrorMsg('')
    var myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
    }

    fetch(API_URL + 'api/sms/' + SmsId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setDeleteLoader(false)
        if (result.status == 'success') {
          setDeleteModal(false)
          getSMSSettings()
          setSuccess(true)
          setSuccessMsg('Setting deleted successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setError(true)
          setErrorMsg(result.message)
        }
      })
      .catch((error) => console.log('error', error))
  }
  const startCalling = () => {
    setCallError(false)
    setCallErrorMSg('')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      numberOfUsers: callNumber,
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(API_URL + 'api/make-call', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.status == 'success') {
          setSuccess(true)
          setTextMessage('')
          setSuccessMsg(result.message)
          getSMSSettings()
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setCallError(true)
          setCallErrorMSg(result.message)
          setTimeout(() => {
            setCallError(false)
            setCallErrorMSg('')
          }, 3000)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }
  return (
    <DefaultLayout>
      <CCard className="mb-3">
        <CCardHeader>Call Settings</CCardHeader>
        <CCardBody>
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center flex-row">
              <span>Your{'  '}</span>
              {/* <input
                  type="number"
                  className="border-b-2 text-center"
                  value={callNumber}
                  onChange={(e) => {
                    setCallNumber(e.target.value)
                    setshowSaveBtn(true)
                  }}
                /> */}
              <span className="flex items-center max-w-[10rem] px-3">
                <button
                  type="button"
                  id="decrement-button"
                  data-input-counter-decrement="quantity-input"
                  className="flex justify-center items-center bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-2 h-9 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  onClick={() => setCallNumber(callNumber - 1)}
                >
                  <CIcon icon={cilMinus} />
                </button>
                <input
                  type="text"
                  id="quantity-input"
                  data-input-counter
                  className="bg-gray-50 border-x-0 border-gray-100 h-9 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={callNumber}
                  onChange={(e) => {
                    setCallNumber(e.target.value)
                    setshowSaveBtn(true)
                  }}
                  required
                />
                <button
                  type="button"
                  id="increment-button"
                  data-input-counter-increment="quantity-input"
                  className="flex justify-center items-center bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-2 h-9 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  onClick={() => setCallNumber(callNumber + 1)}
                >
                  <CIcon icon={cilPlus} />
                </button>
              </span>
              <span>
                {'  '}
                Calls per Hour
              </span>
              {showSaveBtn && (
                <CButton
                  color="success"
                  type="submit"
                  className="px-4 ml-5 text-white focus:border-0 focus:shadow-none"
                  disabled={callLoading ? true : false}
                  onClick={addCallSetting}
                >
                  {callLoading ? <CSpinner color="light" size="sm" /> : 'Save'}
                </CButton>
              )}
            </div>
            <CButton
              color="primary"
              className="px-4 text-white"
              // disabled={callLoading ? true : false}
              onClick={startCalling}
            >
              {callLoading ? (
                <CSpinner color="light" size="sm" />
              ) : (
                <>
                  <CIcon icon={cilPhone} className="mr-2" />
                  Start Calling
                </>
              )}
            </CButton>
          </div>
          {/* <CFormInput
            type="number"
            placeholder="Enter number of calls per hour"
            className="mb-3"
            label="Number of Calls"
            value={callNumber}
            onChange={(e) => setCallNumber(e.target.value)}
          />
          {callNumberError && (
            <span className="text-red-400 mt-3">Number of call is required field.</span>
          )}
          <center>
            <CButton
              color="dark"
              type="submit"
              className="px-4 mt-3 mb-5"
              disabled={callLoading ? true : false}
              onClick={addCallSetting}
            >
              {callLoading ? <CSpinner color="light" size="sm" /> : 'Add More'}
            </CButton>
          </center> */}

          {/* {callSuccess ? (
            <center className="mt-4">
              <CSpinner color="primary" variant="grow" />
            </center>
          ) : (
            <>
              <hr />
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Call per hour</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {callSettings && callSettings.length > 0 ? (
                    callSettings.map((x, i) => (
                      <CTableRow key={i}>
                        <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                        <CTableDataCell>{x.numberOfCallsPerHour}</CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={2} className="text-center">
                        Nothing found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </>
          )} */}
        </CCardBody>
      </CCard>
      <CCard className="mb-3">
        <CCardHeader>SMS Settings</CCardHeader>
        <CCardBody>
          <CFormTextarea
            rows={5}
            placeholder="Enter Message Here..."
            className="mb-3"
            label="Message"
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
          />
          {textMessageError && <span className="text-red-400 mt-3">{textMessageError}</span>}
          <center>
            <CButton
              color="dark"
              type="submit"
              className="px-4 mt-3 mb-5"
              disabled={smsLoading ? true : false}
              onClick={addSMSSetting}
            >
              {smsLoading ? <CSpinner color="light" size="sm" /> : 'Add More'}
            </CButton>
          </center>
          {smsSuccess ? (
            <center className="mt-4">
              <CSpinner color="primary" variant="grow" />
            </center>
          ) : (
            <>
              <hr />
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Message</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {smsSettings && smsSettings.length > 0 ? (
                    smsSettings.map((x, i) => (
                      <CTableRow key={i}>
                        <CTableHeaderCell scope="row">Day {i + 1}</CTableHeaderCell>
                        <CTableDataCell>{x.textMessage}</CTableDataCell>
                        <CTableDataCell>{moment(x.date).format('Do MMMM YYYY')}</CTableDataCell>
                        <CTableDataCell>{moment(x.date).format('h:mm a')}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="success"
                            className="text-white py-2 my-2 mr-2"
                            onClick={(e) => {
                              setViewModal(true)
                              setViewMessage(x.textMessage)
                            }}
                          >
                            View
                          </CButton>
                          <CButton
                            color="primary"
                            className="text-white py-2 my-2 mr-2"
                            onClick={(e) => {
                              setDeleteModal(true)
                              setSmsId(x._id)
                              setError(false)
                              setErrorMsg('')
                            }}
                          >
                            <CIcon icon={cilPen} />
                          </CButton>
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
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={5} className="text-center">
                        Nothing found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </>
          )}
        </CCardBody>
      </CCard>
      {/* delete modal */}
      <CModal
        alignment="center"
        visible={deleteModal}
        onClose={() => setDeleteModal(false)}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Delete SMS Setting</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure to delete this sms setting?
          {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>
            No
          </CButton>
          <CButton color="primary" onClick={deleteSms} disabled={deleteLoader ? true : false}>
            {deleteLoader ? <CSpinner color="light" size="sm" /> : 'Yes'}
          </CButton>
        </CModalFooter>
      </CModal>
      {/* view modal */}
      <CModal
        alignment="center"
        visible={viewModal}
        onClose={() => setViewModal(false)}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Message</CModalTitle>
        </CModalHeader>
        <CModalBody>{viewMessage}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      {success && (
        <CAlert color="success" className="success-alert uppercase">
          {successMsg}
        </CAlert>
      )}
      {callError && (
        <CAlert color="danger" className="success-alert uppercase">
          {callErrorMsg}
        </CAlert>
      )}
    </DefaultLayout>
  )
}
export default Settings
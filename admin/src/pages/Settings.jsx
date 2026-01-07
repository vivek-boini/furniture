import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Settings = () => {
    const [whatsapp, setWhatsapp] = useState('')
    const [call, setCall] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get('https://furniture-server-04rv.onrender.com/api/settings')
                if (res.data) {
                    setWhatsapp(res.data.whatsappNumber)
                    setCall(res.data.callNumber)
                    setAddress(res.data.address)
                    setEmail(res.data.email)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage('')

        try {
            const token = localStorage.getItem('adminToken')
            const config = { headers: { Authorization: `Bearer ${token}` } }

            await axios.put('https://furniture-server-04rv.onrender.com/api/settings', {
                whatsappNumber: whatsapp,
                callNumber: call,
                address,
                email
            }, config)

            setMessage('Settings updated successfully!')
        } catch (err) {
            console.error(err)
            setMessage('Failed to update settings: ' + (err.response?.data?.message || err.message))
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-4">Loading settings...</div>

    return (
        <div className="section">
            <div className="container" style={{ maxWidth: '800px' }}>
                <h2 className="mb-4">Global Settings</h2>

                <div className="card" style={{ padding: '2rem' }}>
                    {message && (
                        <div className={`alert ${message.includes('Failed') ? 'alert-danger' : 'alert-success'} mb-4`}
                            style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: message.includes('Failed') ? '#fee2e2' : '#dcfce7', color: message.includes('Failed') ? '#991b1b' : '#166534' }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSave}>
                        <div className="mb-4">
                            <label className="form-label" style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>WhatsApp Number</label>
                            <input
                                className="form-control"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                value={whatsapp}
                                onChange={e => setWhatsapp(e.target.value)}
                                placeholder="e.g. 919999999999"
                            />
                            <small className="text-muted">Format: Country code + Number (no + symbol for WhatsApp link)</small>
                        </div>

                        <div className="mb-4">
                            <label className="form-label" style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Call Number</label>
                            <input
                                className="form-control"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                value={call}
                                onChange={e => setCall(e.target.value)}
                                placeholder="e.g. +91 99999 99999"
                            />
                            <small className="text-muted">Format: Visual format (e.g. +91 ...)</small>
                        </div>

                        <div className="mb-4">
                            <label className="form-label" style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                            <input
                                className="form-control"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label" style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Store Address</label>
                            <textarea
                                className="form-control"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                rows="3"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                            style={{ padding: '0.75rem 2rem' }}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Settings

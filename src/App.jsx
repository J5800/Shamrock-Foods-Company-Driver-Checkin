import React, { useState, useEffect, useMemo } from 'react'
import {
  Calendar,
  Clock,
  Truck,
  User,
  Building,
  Phone,
  MessageSquare,
  CheckCircle,
  Monitor,
  AlertCircle,
  Users,
  Settings,
  Activity,
  Lock,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react'

/**
 * User credentials - In production, this would be stored securely
 */
const VALID_USERS = {
  'admin': 'shamrock2025',
  'supervisor': 'foods123',
  'manager': 'driver456'
}

/**
 * Login Component
 */
const LoginScreen = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API delay
    await new Promise(r => setTimeout(r, 1000))

    const { username, password } = credentials
    
    if (VALID_USERS[username] && VALID_USERS[username] === password) {
      onLogin(username)
    } else {
      setError('Invalid username or password')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">🍀 Shamrock Foods</h1>
          <p className="text-gray-600 mt-2">Driver Check-in System</p>
          <p className="text-sm text-gray-500 mt-1">Secure Access Required</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              isLoading
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <div><strong>Admin:</strong> admin / shamrock2025</div>
            <div><strong>Supervisor:</strong> supervisor / foods123</div>
            <div><strong>Manager:</strong> manager / driver456</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Session timeout and security features
 */
const useSecurityFeatures = (username) => {
  const [sessionTimeout, setSessionTimeout] = useState(30 * 60 * 1000) // 30 minutes
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [showTimeout, setShowTimeout] = useState(false)

  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now())
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true)
    })

    const timer = setInterval(() => {
      const timeElapsed = Date.now() - lastActivity
      if (timeElapsed > sessionTimeout - 60000) { // Show warning 1 minute before timeout
        setShowTimeout(true)
      }
    }, 10000) // Check every 10 seconds

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true)
      })
      clearInterval(timer)
    }
  }, [lastActivity, sessionTimeout])

  return { showTimeout, setShowTimeout }
}

// [Rest of your existing app components with the same section definitions, dock management, etc.]

/**
 * Section definitions
 */
const sectionDefinitions = [
  { name: 'Driver Check-In Doors (201–203)', start: 201, end: 203 },
  { name: 'Cooler Section (204–216)', start: 204, end: 216 },
  { name: 'Freezer Section (217–232)', start: 217, end: 232 },
  { name: 'Dry Dock (233–240)', start: 233, end: 240 },
  { name: 'Driver Check-In Doors (241–243)', start: 241, end: 243 }
]

/**
 * Generates docks with section info
 */
const generateSectionedDocks = () => {
  return sectionDefinitions.flatMap(section =>
    Array.from({ length: section.end - section.start + 1 }, (_, i) => {
      const num = section.start + i
      return {
        id: `dock-${num}`,
        name: `Dock ${num}`,
        section: section.name,
        status: 'available',
        currentDriver: '',
        lastUpdated: null
      }
    })
  )
}

/**
 * Reusable form field
 */
const FormField = ({
  icon: Icon,
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  rows,
  required = false
}) => {
  if (type === 'textarea') {
    return (
      <div className="space-y-2">
        <label className="flex items-center text-white font-semibold">
          <Icon className="w-5 h-5 mr-2 text-white" />
          {label} {required && <span className="text-yellow-300 ml-1">*</span>}
        </label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 4}
          className="w-full p-3 bg-white/20 rounded-lg text-black placeholder-gray-600 focus:ring-2 focus:ring-green-300"
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="flex items-center text-white font-semibold">
        <Icon className="w-5 h-5 mr-2 text-white" />
        {label} {required && <span className="text-yellow-300 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 bg-white/20 rounded-lg text-black placeholder-gray-600 focus:ring-2 focus:ring-green-300"
      />
    </div>
  )
}

/**
 * Dock card component with enhanced actions
 */
const DockCard = ({ dock, onToggleMaintenance, checkIns, onReassignToDock }) => {
  const styleMap = {
    available: 'border-green-700 bg-white text-black',
    occupied: 'border-red-700 bg-white text-black',
    maintenance: 'border-yellow-700 bg-white text-black'
  }[dock.status]

  const labelMap = {
    available: '🟢 Available',
    occupied: '🔴 Occupied',
    maintenance: '🟡 Maintenance'
  }[dock.status]

  const currentCheckIn = checkIns.find(ci => ci.dock === dock.name && ci.status === 'Checked In')

  return (
    <div className={`p-4 rounded-lg border ${styleMap} shadow-md`}>
      <div className="font-bold mb-1">{dock.name}</div>
      <div className="mb-2">{labelMap}</div>
      {dock.currentDriver && (
        <div className="text-sm text-gray-600 mb-2">
          <div>Driver: {dock.currentDriver}</div>
          {currentCheckIn && (
            <div>Company: {currentCheckIn.company}</div>
          )}
        </div>
      )}
      
      <div className="space-y-2">
        {/* Quick Check-out for occupied docks */}
        {dock.status === 'occupied' && currentCheckIn && (
          <button
            onClick={() => onReassignToDock(currentCheckIn.id, 'checkout')}
            className="w-full py-1 rounded text-sm bg-green-600 text-white hover:bg-green-700"
          >
            Complete & Check Out
          </button>
        )}
        
        {/* Maintenance toggle */}
        <button
          onClick={() => onToggleMaintenance(dock.name)}
          disabled={dock.status === 'occupied'}
          className={`w-full py-1 rounded text-sm ${
            dock.status === 'occupied' 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : dock.status === 'maintenance'
              ? 'bg-green-700 text-white hover:bg-green-800'
              : 'bg-yellow-700 text-white hover:bg-yellow-800'
          }`}
        >
          {dock.status === 'occupied' 
            ? 'In Use' 
            : dock.status === 'maintenance' 
            ? 'Return to Service' 
            : 'Set Maintenance'
          }
        </button>
      </div>
    </div>
  )
}

/**
 * Main Secured Application Component
 */
const SecuredDriverCheckIn = ({ username, onLogout }) => {
  const [formData, setFormData] = useState({
    driverName: '',
    trailerNumber: '',
    company: '',
    assignedDock: '',
    truckNumber: '',
    arrivalTime: '',
    phoneNumber: '',
    comments: ''
  })

  const [docks, setDocks] = useState(() => generateSectionedDocks())
  const [checkIns, setCheckIns] = useState([
    { 
      id: 1, 
      driverName: 'Mike Johnson', 
      company: 'ABC Logistics', 
      dock: 'Dock 201', 
      time: '10:15 AM', 
      status: 'In Progress',
      trailerNumber: 'TRL-001',
      truckNumber: 'TRK-456'
    }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [activeView, setActiveView] = useState('checkin')

  const { showTimeout, setShowTimeout } = useSecurityFeatures(username)

  useEffect(() => {
    setFormData(fd => ({
      ...fd,
      arrivalTime: new Date().toTimeString().slice(0,5)
    }))
  }, [])

  const availableDocks = useMemo(() => docks.filter(d => d.status === 'available'), [docks])
  
  // Fixed form validation - only require essential fields
  const isFormValid = formData.driverName && 
                     formData.trailerNumber && 
                     formData.company && 
                     formData.assignedDock && 
                     formData.arrivalTime

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(fd => ({ ...fd, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!isFormValid) return
    
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))

    // update dock
    setDocks(ds =>
      ds.map(d =>
        d.name === formData.assignedDock
          ? { ...d, status: 'occupied', currentDriver: formData.driverName, lastUpdated: new Date().toTimeString().slice(0,5) }
          : d
      )
    )

    // add check-in with security audit trail
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    setCheckIns(ci => [
      ...ci,
      { 
        id: ci.length + 1, 
        driverName: formData.driverName,
        company: formData.company,
        dock: formData.assignedDock,
        time, 
        status: 'Checked In',
        trailerNumber: formData.trailerNumber,
        truckNumber: formData.truckNumber || 'N/A',
        checkedInBy: username,
        timestamp: new Date().toISOString()
      }
    ])

    // notification with user audit
    setNotifications(n => [
      { id: Date.now(), time, message: `${formData.driverName} checked in at ${formData.assignedDock} by ${username}` },
      ...n
    ])

    setIsSubmitting(false)
    setSubmitSuccess(true)
    setTimeout(() => {
      setSubmitSuccess(false)
      // Reset form
      setFormData({
        driverName: '',
        trailerNumber: '',
        company: '',
        assignedDock: '',
        truckNumber: '',
        arrivalTime: new Date().toTimeString().slice(0,5),
        phoneNumber: '',
        comments: ''
      })
    }, 3000)
  }

  const toggleMaintenance = dockName => {
    setDocks(ds =>
      ds.map(d =>
        d.name === dockName
          ? { ...d, status: d.status === 'maintenance' ? 'available' : 'maintenance', currentDriver: '' }
          : d
      )
    )
  }

  const handleCheckOut = (checkInId) => {
    const checkIn = checkIns.find(ci => ci.id === checkInId)
    if (checkIn) {
      // Free up the dock
      setDocks(ds =>
        ds.map(d =>
          d.name === checkIn.dock
            ? { ...d, status: 'available', currentDriver: '', lastUpdated: new Date().toTimeString().slice(0,5) }
            : d
        )
      )
      
      // Update check-in status with audit trail
      const checkOutTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      setCheckIns(ci =>
        ci.map(c =>
          c.id === checkInId
            ? { ...c, status: 'Checked Out', checkOutTime, checkedOutBy: username, checkoutTimestamp: new Date().toISOString() }
            : c
        )
      )

      // Add notification with user audit
      setNotifications(n => [
        { id: Date.now(), time: checkOutTime, message: `${checkIn.driverName} checked out from ${checkIn.dock} by ${username}` },
        ...n
      ])
    }
  }

  const handleReassignDock = (checkInId, newDockName) => {
    const checkIn = checkIns.find(ci => ci.id === checkInId)
    if (checkIn && newDockName) {
      // Free up old dock
      setDocks(ds =>
        ds.map(d => {
          if (d.name === checkIn.dock) {
            return { ...d, status: 'available', currentDriver: '', lastUpdated: new Date().toTimeString().slice(0,5) }
          }
          if (d.name === newDockName) {
            return { ...d, status: 'occupied', currentDriver: checkIn.driverName, lastUpdated: new Date().toTimeString().slice(0,5) }
          }
          return d
        })
      )
      
      // Update check-in with new dock
      setCheckIns(ci =>
        ci.map(c =>
          c.id === checkInId
            ? { ...c, dock: newDockName, reassignedTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), reassignedBy: username }
            : c
        )
      )

      // Add notification
      const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      setNotifications(n => [
        { id: Date.now(), time, message: `${checkIn.driverName} reassigned from ${checkIn.dock} to ${newDockName} by ${username}` },
        ...n
      ])
    }
  }

  const handleReassignOrCheckout = (checkInId, action) => {
    if (action === 'checkout') {
      handleCheckOut(checkInId)
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-[#009E60] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <CheckCircle className="mx-auto text-green-700 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Check-In Successful!</h2>
          <p className="text-gray-600 mb-4">
            Welcome, {formData.driverName}!<br />
            You've been assigned to {formData.assignedDock}
          </p>
          <div className="text-sm text-gray-500">
            Processed by: {username}<br />
            Returning to main screen...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#009E60] p-6">
      {/* Session Timeout Warning */}
      {showTimeout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-center mb-4">Session Timeout Warning</h3>
            <p className="text-gray-600 text-center mb-4">
              Your session will expire in 1 minute due to inactivity.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowTimeout(false)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Continue Session
              </button>
              <button
                onClick={onLogout}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with User Info */}
      <header className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">🍀 Shamrock Foods Company Driver Checkin</h1>
        <div className="flex items-center space-x-4">
          <nav className="flex space-x-2">
            {[
              { key: 'checkin', label: 'Check-In', icon: User },
              { key: 'dashboard', label: 'Dashboard', icon: Monitor },
              { key: 'admin', label: 'Admin', icon: Settings }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeView === key 
                    ? 'bg-white text-green-700' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
          <div className="text-white text-sm">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Logged in as: <strong className="ml-1">{username}</strong>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Check-In View */}
      {activeView === 'checkin' && (
        <main className="max-w-6xl mx-auto bg-white/10 p-6 rounded-xl space-y-6">
          <div className="bg-white/20 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Driver Check-In Form</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                icon={User} 
                label="Driver Name" 
                name="driverName" 
                value={formData.driverName} 
                onChange={handleInputChange} 
                placeholder="John Doe" 
                required 
              />
              <FormField 
                icon={Truck} 
                label="Trailer Number" 
                name="trailerNumber" 
                value={formData.trailerNumber} 
                onChange={handleInputChange} 
                placeholder="TRL-123" 
                required 
              />
              <FormField 
                icon={Building} 
                label="Company" 
                name="company" 
                value={formData.company} 
                onChange={handleInputChange} 
                placeholder="Acme Co." 
                required 
              />
              <FormField 
                icon={Truck} 
                label="Truck Number" 
                name="truckNumber" 
                value={formData.truckNumber} 
                onChange={handleInputChange} 
                placeholder="TRK-456 (Optional)" 
              />
              <div className="space-y-2">
                <label className="flex items-center text-white font-semibold">
                  <Calendar className="w-5 h-5 mr-2 text-white" />
                  Assigned Dock <span className="text-yellow-300 ml-1">*</span>
                </label>
                <select
                  name="assignedDock"
                  value={formData.assignedDock}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white text-black rounded-lg focus:ring-2 focus:ring-green-300"
                >
                  <option value="">Select Available Dock</option>
                  {availableDocks.map(d => (
                    <option key={d.id} value={d.name}>{d.name} - {d.section}</option>
                  ))}
                </select>
              </div>
              <FormField 
                icon={Clock} 
                label="Arrival Time" 
                name="arrivalTime" 
                type="time" 
                value={formData.arrivalTime} 
                onChange={handleInputChange} 
                required 
              />
              <FormField 
                icon={Phone} 
                label="Phone Number" 
                name="phoneNumber" 
                type="tel" 
                value={formData.phoneNumber} 
                onChange={handleInputChange} 
                placeholder="(555) 123-4567" 
              />
              <div className="md:col-span-2">
                <FormField 
                  icon={MessageSquare} 
                  label="Comments" 
                  name="comments" 
                  type="textarea" 
                  value={formData.comments} 
                  onChange={handleInputChange} 
                  placeholder="Special instructions or notes..." 
                />
              </div>
            </div>
            <button
              disabled={!isFormValid || isSubmitting}
              onClick={handleSubmit}
              className={`w-full mt-6 py-4 font-bold text-lg rounded-lg transition-colors ${
                isFormValid && !isSubmitting
                  ? 'bg-white text-green-700 hover:bg-green-50' 
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? '⏳ Processing Check-In...' : '✅ Complete Check-In'}
            </button>
          </div>

          {/* Dock Status Display */}
          {sectionDefinitions.map(section => {
            const docksInSection = docks.filter(d => d.section === section.name)
            const cols = docksInSection.length === 3 ? 'grid-cols-3' : 'grid-cols-5'
            return (
              <section key={section.name} className="space-y-4">
                <h2 className="text-xl text-white font-semibold bg-white/20 p-3 rounded-lg">
                  {section.name}
                </h2>
                <div className={`grid ${cols} gap-4`}>
                  {docksInSection.map(d => (
                    <DockCard 
                      key={d.id} 
                      dock={d} 
                      onToggleMaintenance={toggleMaintenance}
                      checkIns={checkIns}
                      onReassignToDock={handleReassignOrCheckout}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </main>
      )}

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <main className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white/10 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Monitor className="w-6 h-6 mr-2" />
              Operations Dashboard
            </h2>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-700">{checkIns.filter(c => c.status === 'Checked In').length}</div>
                <div className="text-gray-600">Active Check-ins</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-700">{availableDocks.length}</div>
                <div className="text-gray-600">Available Docks</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-700">{docks.filter(d => d.status === 'occupied').length}</div>
                <div className="text-gray-600">Occupied Docks</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-700">{docks.filter(d => d.status === 'maintenance').length}</div>
                <div className="text-gray-600">Maintenance</div>
              </div>
            </div>

            {/* Current Check-ins */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Current Check-ins</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">Driver</th>
                      <th className="py-2 text-left">Company</th>
                      <th className="py-2 text-left">Dock Assignment</th>
                      <th className="py-2 text-left">Check-in/Out Times</th>
                      <th className="py-2 text-left">Status</th>
                      <th className="py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkIns.map(checkIn => (
                      <tr key={checkIn.id} className="border-b">
                        <td className="py-3 font-semibold">{checkIn.driverName}</td>
                        <td className="py-3">{checkIn.company}</td>
                        <td className="py-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{checkIn.dock}</span>
                            {checkIn.reassignedTime && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Reassigned {checkIn.reassignedTime}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <div>
                            <div>In: {checkIn.time}</div>
                            {checkIn.checkOutTime && (
                              <div className="text-sm text-gray-600">Out: {checkIn.checkOutTime}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-sm ${
                            checkIn.status === 'Checked In' ? 'bg-green-100 text-green-800' : 
                            checkIn.status === 'Checked Out' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {checkIn.status}
                          </span>
                        </td>
                        <td className="py-3">
                          {checkIn.status === 'Checked In' && (
                            <div className="flex flex-col space-y-2">
                              {/* Reassign Dock */}
                              <div className="flex items-center space-x-2">
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleReassignDock(checkIn.id, e.target.value)
                                      e.target.value = ''
                                    }
                                  }}
                                  className="text-xs p-1 border rounded"
                                  defaultValue=""
                                >
                                  <option value="">Reassign Dock</option>
                                  {availableDocks.map(d => (
                                    <option key={d.id} value={d.name}>{d.name}</option>
                                  ))}
                                </select>
                              </div>
                              {/* Check Out Button */}
                              <button
                                onClick={() => handleCheckOut(checkIn.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                              >
                                Complete & Check Out
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Admin View */}
      {activeView === 'admin' && (
        <main className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white/10 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              System Administration
            </h2>
            
            {/* Admin Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Dock Management</h3>
                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      setDocks(ds => ds.map(d => ({ ...d, status: 'available', currentDriver: '' })))
                    }}
                    className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Clear All Docks
                  </button>
                  <button 
                    onClick={() => {
                      setDocks(ds => ds.map(d => d.status === 'maintenance' ? { ...d, status: 'available' } : d))
                    }}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Clear Maintenance Mode
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Data Management</h3>
                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      setCheckIns([])
                      setNotifications([])
                    }}
                    className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Clear Check-in History
                  </button>
                  <button 
                    onClick={() => {
                      const data = JSON.stringify({ docks, checkIns, notifications }, null, 2)
                      const blob = new Blob([data], { type: 'application/json' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'shamrock-data-export.json'
                      a.click()
                    }}
                    className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Export Data
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Notifications */}
            {notifications.length > 0 && (
              <div className="bg-white p-6 rounded-lg mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>{notification.message}</span>
                      <span className="text-sm text-gray-500">{notification.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  )
}

/**
 * Main App Component with Authentication
 */
const DriverCheckIn = () => {
  const [user, setUser] = useState(null)

  const handleLogin = (username) => {
    setUser(username)
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return <SecuredDriverCheckIn username={user} onLogout={handleLogout} />
}

export default DriverCheckIn
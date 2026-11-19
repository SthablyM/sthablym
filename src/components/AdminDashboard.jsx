
import { useEffect, useState } from 'react'
import './AdminDashboard.css'

function AdminDashboard({ onLogout }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [statusError, setStatusError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')


useEffect(() => {
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/orders',
        {
          method: 'GET',
          credentials: 'include'
        }
      )

      const data = await response.json()

      console.log('Orders API status:', response.status)
      console.log('Orders API response:', data)

      if (!response.ok) {
        throw new Error(
          data.error || `Server error: ${response.status}`
        )
      }

      setOrders(data.orders || [])
      setError('')

    } catch (err) {
      console.error('Orders request failed:', err)
      setError(err.message)

    } finally {
      setLoading(false)
    }
  }

  fetchOrders()
}, [])


  const pendingOrders = orders.filter(
    order => order.status === 'Pending'
  ).length

  const paidOrders = orders.filter(
    order => order.status === 'Paid'
  ).length

  const completedOrders = orders.filter(
    order => order.status === 'Completed'
  ).length
  const filteredOrders = orders.filter(order => {
  const search = searchTerm.toLowerCase()

  const matchesSearch =
    `STB-${order.id}`.toLowerCase().includes(search) ||
    order.customer_name.toLowerCase().includes(search) ||
    order.design_title.toLowerCase().includes(search)

  const matchesStatus =
    statusFilter === 'All' || order.status === statusFilter

  return matchesSearch && matchesStatus
})


const handleStatusChange = async (newStatus) => {
  if (!selectedOrder) return

  setUpdatingStatus(true)
  setStatusError('')

  try {
    const response = await fetch(
      `http://localhost:5000/api/orders/${selectedOrder.id}/status`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Could not update order status.')
    }

    const updatedOrder = {
      ...selectedOrder,
      status: data.status
    }

    setOrders(previousOrders =>
      previousOrders.map(order =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    )

    setSelectedOrder(updatedOrder)

  } catch (error) {
    setStatusError(error.message)
  } finally {
    setUpdatingStatus(false)
  }
}

  return (
    <section className="admin-dashboard">

      <div className="admin-header">
  <div>
    <p className="admin-label">STHABLYM MANAGEMENT</p>
    <h1>Admin Dashboard</h1>
    <p>Manage your customer orders and business activity.</p>
  </div>

  <button
    className="admin-logout-button"
    onClick={onLogout}
  >
    Log out ↗
  </button>
</div>

      {loading && <p>Loading orders...</p>}

      {error && <p className="admin-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="admin-stats">

            <div className="stat-card">
              <p>Total Orders</p>
              <h2>{orders.length}</h2>
            </div>

            <div className="stat-card">
              <p>Pending Orders</p>
              <h2>{pendingOrders}</h2>
            </div>

            <div className="stat-card">
              <p>Paid Orders</p>
              <h2>{paidOrders}</h2>
            </div>

            <div className="stat-card">
              <p>Completed Orders</p>
              <h2>{completedOrders}</h2>
            </div>

          </div>

          <div className="orders-section">
             <h2>Customer Orders</h2>

            <div className="order-filters">

                <input
                  type="text"
                  placeholder="Search orders, customers or designs..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="order-search-input"
                 />

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="order-filter-select"
                >
                  <option value="All">All Orders</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      </select>

                  </div>

            {filteredOrders.length === 0 ? (
               <p>No matching orders found.</p>
            ) : (
              <div className="orders-table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Design</th>
                      <th>Purchase Type</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Attachments</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map(order => (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="clickable-order"
                      >
                        <td>STB-{order.id}</td>
                        <td>{order.customer_name}</td>
                        <td>{order.design_title}</td>
                        <td>{order.purchase_type}</td>
                        <td>R{Number(order.price).toFixed(2)}</td>
                        <td>
                          <span className="order-status">
                            {order.status}
                          </span>
                        </td>
                        <td>{order.attachments?.length || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selectedOrder && (
            <div className="order-details">

              <div className="details-header">
                <div>
                  <p className="admin-label">ORDER INFORMATION</p>
                  <h2>STB-{selectedOrder.id}</h2>
                </div>

                <button
                  className="close-details"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close ×
                </button>
              </div>

              <div className="details-grid">

                <div className="detail-item">
                  <span>Customer name</span>
                  <strong>{selectedOrder.customer_name}</strong>
                </div>

                <div className="detail-item">
                  <span>Email address</span>
                  <strong>{selectedOrder.email}</strong>
                </div>

                <div className="detail-item">
                  <span>Phone number</span>
                  <strong>{selectedOrder.phone}</strong>
                </div>

                <div className="detail-item">
                  <span>Business name</span>
                  <strong>{selectedOrder.business_name || 'Not provided'}</strong>
                </div>

                <div className="detail-item">
                  <span>Design selected</span>
                  <strong>{selectedOrder.design_title}</strong>
                </div>

                <div className="detail-item">
                  <span>Category</span>
                  <strong>{selectedOrder.category || 'Not applicable'}</strong>
                </div>

                <div className="detail-item">
                  <span>Purchase type</span>
                  <strong>{selectedOrder.purchase_type}</strong>
                </div>

                <div className="detail-item">
                  <span>Price</span>
                  <strong>R{Number(selectedOrder.price).toFixed(2)}</strong>
                </div>

                <div className="detail-item">
                  <span>Order status</span>

                    <select
                         value={selectedOrder.status}
                           onChange={(event) => handleStatusChange(event.target.value)}
                            disabled={updatingStatus}
                           className="order-status-select"
                             >
                              <option value="Pending">Pending</option>
                                   <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                      </select>

                                         {updatingStatus && <small>Updating status...</small>}
                   {statusError && <small className="admin-error">{statusError}</small>}
                   </div>

                <div className="detail-item">
                  <span>Order date</span>
                  <strong>{selectedOrder.created_at}</strong>
                </div>

              </div>

              <div className="detail-description">
                <h3>Preferred colours</h3>
                <p>{selectedOrder.colours || 'No colours specified.'}</p>
              </div>


                <div className="detail-description">
                  <h3>Uploaded reference files</h3>

                  {selectedOrder.attachments?.length > 0 ? (
                    <ul className="attachment-list">
                      {selectedOrder.attachments.map(file => (
                        <li key={file.id}>
                          <span>{file.original_filename}</span>

                            <a
                          href={`http://localhost:5000/api/admin/attachments/${file.id}`}
                          className="attachment-download"
                        >
                          Download
                        </a>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No files uploaded for this order.</p>
                          )}
                        </div>
            </div>
          )}
        </>
      )}

    </section>
  )
}

export default AdminDashboard

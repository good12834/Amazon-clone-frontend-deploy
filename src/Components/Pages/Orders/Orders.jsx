import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classes from './Orders.module.css';
import LayOut from '../../LayOut/LayOut';
import OrderTracking from '../../Product/OrderTracking';
import authService from '../../../services/authService';
import orderService from '../../../services/orderService';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTracking, setShowTracking] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnItems, setReturnItems] = useState([]);
  const [returnMethod, setReturnMethod] = useState('dropoff');
  const [returns, setReturns] = useState([]);

  // Mock order data - in real app, this would come from API
  const mockOrders = [
    {
      id: 'AMZ-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 129.99,
      items: [
        { id: 1, title: 'Wireless Headphones', price: 79.99, quantity: 1, image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg' },
        { id: 2, title: 'Smart Watch', price: 50.00, quantity: 1, image: 'https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg' }
      ],
      tracking: {
        number: 'TRK123456789',
        carrier: 'Amazon Logistics',
        status: 'Delivered',
        estimatedDelivery: 'Jan 18, 2024'
      }
    },
    {
      id: 'AMZ-002',
      date: '2024-01-10',
      status: 'shipped',
      total: 89.99,
      items: [
        { id: 3, title: 'Bluetooth Speaker', price: 89.99, quantity: 1, image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg' }
      ],
      tracking: {
        number: 'TRK987654321',
        carrier: 'Amazon Logistics',
        status: 'Out for delivery',
        estimatedDelivery: 'Jan 20, 2024'
      }
    },
    {
      id: 'AMZ-003',
      date: '2024-01-05',
      status: 'processing',
      total: 199.99,
      items: [
        { id: 4, title: 'Gaming Laptop', price: 199.99, quantity: 1, image: 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg' }
      ],
      tracking: {
        number: 'TRK555666777',
        carrier: 'Amazon Logistics',
        status: 'Processing',
        estimatedDelivery: 'Jan 25, 2024'
      }
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          const [userOrders, userReturns] = await Promise.all([
            orderService.getUserOrders(user.uid),
            orderService.getUserReturns(user.uid)
          ]);
          setOrders(userOrders);
          setReturns(userReturns);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to mock data if Firestore fails
        setOrders(mockOrders);
        setReturns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchTerm === '' ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      processing: '#ffc107',
      shipped: '#17a2b8',
      delivered: '#28a745',
      cancelled: '#dc3545',
      returned: '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusText = (status) => {
    const texts = {
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      returned: 'Returned'
    };
    return texts[status] || status;
  };

  const handleTrackPackage = (orderId) => {
    setSelectedOrderId(orderId);
    setShowTracking(true);
  };

  const handleCloseTracking = () => {
    setShowTracking(false);
    setSelectedOrderId(null);
  };

  const handleReturnItems = (order) => {
    if (!orderService.isEligibleForReturn(order.date)) {
      alert('This order is not eligible for return. Returns are only available within 30 days of delivery.');
      return;
    }
    setSelectedOrderForReturn(order);
    setReturnItems(order.items.map(item => ({ ...item, selected: false })));
    setReturnReason('');
    setReturnMethod('dropoff');
    setShowReturnModal(true);
  };

  const handleReturnSubmit = async () => {
    if (returnItems.filter(item => item.selected).length === 0) {
      alert('Please select at least one item to return.');
      return;
    }
    if (!returnReason) {
      alert('Please select a return reason.');
      return;
    }

    try {
      const user = authService.getCurrentUser();
      const selectedItems = returnItems.filter(item => item.selected);

      const returnData = {
        userId: user.uid,
        orderId: selectedOrderForReturn.id,
        items: selectedItems,
        reason: returnReason,
        method: returnMethod,
        refundAmount: selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'requested'
      };

      await orderService.createReturn(returnData);
      alert('Return request submitted successfully!');
      setShowReturnModal(false);
      // Refresh orders to show updated status
      window.location.reload();
    } catch (error) {
      console.error('Error submitting return:', error);
      alert('Failed to submit return request. Please try again.');
    }
  };

  const handleItemSelection = (index) => {
    const updatedItems = [...returnItems];
    updatedItems[index].selected = !updatedItems[index].selected;
    setReturnItems(updatedItems);
  };

  if (loading) {
    return (
      <LayOut>
        <div className={classes.loading}>
          <div className={classes.loading_text}>Loading your orders...</div>
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <div className={classes.orders_container}>
        <div className={classes.orders_header}>
          <h1>Your Orders</h1>
          <div className={classes.header_subtitle}>
            <span className={classes.header_description}>Track, return, or buy things again</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={classes.tabs}>
          <button
            className={`${classes.tab} ${activeTab === 'orders' ? classes.active : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Your Orders
          </button>
          <button
            className={`${classes.tab} ${activeTab === 'returns' ? classes.active : ''}`}
            onClick={() => setActiveTab('returns')}
          >
            Returns & Refunds
          </button>
          <button
            className={`${classes.tab} ${activeTab === 'service' ? classes.active : ''}`}
            onClick={() => setActiveTab('service')}
          >
            Customer Service
          </button>
        </div>

        {/* Search and Filter */}
        <div className={classes.controls}>
          <div className={classes.search_box}>
            <input
              type="text"
              placeholder="Search all orders"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={classes.search_input}
            />
          </div>
          <div className={classes.filters}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={classes.filter_select}
            >
              <option value="all">All Orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Content */}
        {activeTab === 'orders' && (
          <div className={classes.orders_content}>
            {filteredOrders.length === 0 ? (
              <div className={classes.empty_state}>
                <h3>No orders found</h3>
                <p>You haven't placed any orders yet.</p>
                <Link to="/" className={classes.shop_now_btn}>
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className={classes.orders_list}>
                {filteredOrders.map((order) => (
                  <div key={order.id} className={classes.order_card}>
                    <div className={classes.order_top_row}>
                      <div className={classes.order_date}>
                        <span className={classes.date_label}>ORDER PLACED</span>
                        <span className={classes.date_value}>{new Date(order.date).toLocaleDateString()}</span>
                      </div>
                      <div className={classes.order_total}>
                        <span className={classes.total_label}>TOTAL</span>
                        <span className={classes.total_amount}>${order.total}</span>
                      </div>
                      <div className={classes.order_number}>
                        <span className={classes.order_label}>ORDER #</span>
                        <span className={classes.order_value}>{order.id}</span>
                      </div>
                    </div>

                    <div className={classes.order_middle_row}>
                      <div className={classes.order_images}>
                        {order.items.slice(0, 4).map((item, index) => (
                          <img
                            key={item.id}
                            src={item.image}
                            alt={item.title}
                            className={classes.order_item_image}
                          />
                        ))}
                        {order.items.length > 4 && (
                          <div className={classes.more_items}>+{order.items.length - 4} more</div>
                        )}
                      </div>
                      <div className={classes.order_status_section}>
                        <span
                          className={classes.status_badge}
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>

                    <div className={classes.order_bottom_row}>
                      <div className={classes.order_actions}>
                        <button
                          className={classes.track_btn}
                          onClick={() => handleTrackPackage(order.id)}
                        >
                          Track package
                        </button>
                        <button
                          className={classes.return_btn}
                          onClick={() => handleReturnItems(order)}
                          disabled={order.status !== 'delivered'}
                        >
                          Return items
                        </button>
                        <button className={classes.buy_again_btn}>
                          Buy it again
                        </button>
                      </div>
                    </div>

                    {order.tracking && (
                      <div className={classes.tracking_info}>
                        <div className={classes.tracking_header}>
                          <span className={classes.tracking_title}>Tracking information</span>
                          <span className={classes.tracking_status}>{order.tracking.status}</span>
                        </div>
                        <p className={classes.tracking_details}>
                          {order.tracking.carrier} {order.tracking.number}
                        </p>
                        <p className={classes.delivery_estimate}>
                          Estimated delivery: {order.tracking.estimatedDelivery}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Returns & Refunds Tab */}
        {activeTab === 'returns' && (
          <div className={classes.returns_content}>
            <div className={classes.returns_header}>
              <h2>Manage Returns & Refunds</h2>
              <p>Return items within 30 days of delivery for a full refund.</p>
            </div>

            {returns.length === 0 ? (
              <div className={classes.empty_returns}>
                <h3>No returns found</h3>
                <p>You haven't submitted any return requests yet.</p>
              </div>
            ) : (
              <div className={classes.returns_list}>
                {returns.map((returnItem) => (
                  <div key={returnItem.id} className={classes.return_card}>
                    <div className={classes.return_header}>
                      <div className={classes.return_meta}>
                        <span className={classes.return_id}>Return #{returnItem.id.slice(-8)}</span>
                        <span className={classes.return_date}>
                          Requested on {new Date(returnItem.createdAt.toDate()).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={classes.return_status}>
                        <span className={`${classes.status_badge} ${classes[`status_${returnItem.status}`]}`}>
                          {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className={classes.return_items}>
                      {returnItem.items.map((item, index) => (
                        <div key={index} className={classes.return_item}>
                          <img src={item.image} alt={item.title} className={classes.item_image} />
                          <div className={classes.item_details}>
                            <h4>{item.title}</h4>
                            <p>Quantity: {item.quantity}</p>
                            <p>Reason: {returnItem.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={classes.return_info}>
                      <div className={classes.info_row}>
                        <span>Order ID:</span>
                        <span>{returnItem.orderId.slice(-8)}</span>
                      </div>
                      <div className={classes.info_row}>
                        <span>Return Method:</span>
                        <span>{returnItem.method === 'dropoff' ? 'Drop off' : 'Pickup'}</span>
                      </div>
                      <div className={classes.info_row}>
                        <span>Refund Amount:</span>
                        <span>${returnItem.refundAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Customer Service Tab */}
        {activeTab === 'service' && (
          <div className={classes.service_content}>
            <div className={classes.service_header}>
              <h2>Customer Service</h2>
              <p>Get help with your orders and account.</p>
            </div>

            <div className={classes.service_options}>
              <div className={classes.service_card}>
                <h3>Contact Us</h3>
                <p>Need help? Our customer service team is here to assist.</p>
                <button className={classes.service_btn}>
                  Contact Support
                </button>
              </div>

              <div className={classes.service_card}>
                <h3>Help Center</h3>
                <p>Find answers to common questions and issues.</p>
                <button className={classes.service_btn}>
                  Browse Help Topics
                </button>
              </div>

              <div className={classes.service_card}>
                <h3>Live Chat</h3>
                <p>Chat with a customer service representative.</p>
                <button className={classes.service_btn}>
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Tracking Modal */}
        {showTracking && (
          <OrderTracking
            orderId={selectedOrderId}
            onClose={handleCloseTracking}
          />
        )}

        {/* Return Request Modal */}
        {showReturnModal && (
          <div className={classes.modal_overlay}>
            <div className={classes.return_modal}>
              <div className={classes.modal_header}>
                <h2>Return Items</h2>
                <button
                  className={classes.close_btn}
                  onClick={() => setShowReturnModal(false)}
                >
                  ×
                </button>
              </div>

              <div className={classes.modal_content}>
                <div className={classes.return_policy}>
                  <h3>Return Policy</h3>
                  <p>You can return items within 30 days of delivery for a full refund.</p>
                  <p>Items must be in original condition with all packaging and accessories.</p>
                </div>

                <div className={classes.return_items}>
                  <h3>Select Items to Return</h3>
                  {returnItems.map((item, index) => (
                    <div key={index} className={classes.return_item}>
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleItemSelection(index)}
                      />
                      <img src={item.image} alt={item.title} className={classes.item_image} />
                      <div className={classes.item_details}>
                        <h4>{item.title}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p>${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={classes.return_reason}>
                  <h3>Return Reason</h3>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className={classes.reason_select}
                  >
                    <option value="">Select a reason</option>
                    <option value="defective">Item is defective</option>
                    <option value="wrong_item">Wrong item received</option>
                    <option value="not_as_described">Not as described</option>
                    <option value="changed_mind">Changed my mind</option>
                    <option value="better_price">Found better price</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={classes.return_method}>
                  <h3>Return Method</h3>
                  <div className={classes.method_options}>
                    <label>
                      <input
                        type="radio"
                        value="dropoff"
                        checked={returnMethod === 'dropoff'}
                        onChange={(e) => setReturnMethod(e.target.value)}
                      />
                      Drop off at Amazon location
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="pickup"
                        checked={returnMethod === 'pickup'}
                        onChange={(e) => setReturnMethod(e.target.value)}
                      />
                      Schedule pickup
                    </label>
                  </div>
                </div>

                <div className={classes.refund_info}>
                  <h3>Refund Information</h3>
                  <p>
                    Refund Amount: $
                    {returnItems
                      .filter(item => item.selected)
                      .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                      .toFixed(2)}
                  </p>
                  <p>Refund will be processed within 3-5 business days after we receive your return.</p>
                </div>
              </div>

              <div className={classes.modal_actions}>
                <button
                  className={classes.cancel_btn}
                  onClick={() => setShowReturnModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={classes.submit_btn}
                  onClick={handleReturnSubmit}
                >
                  Submit Return Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayOut>
  );
}

export default Orders;
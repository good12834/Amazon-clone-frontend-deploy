import React, { useState, useEffect } from 'react';
import classes from './OrderTracking.module.css';

function OrderTracking({ orderId, onClose }) {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock tracking data - in real app, this would come from API
  const mockTrackingData = {
    orderId: orderId || 'AMZ-001',
    status: 'shipped',
    carrier: 'Amazon Logistics',
    trackingNumber: 'TRK123456789',
    estimatedDelivery: 'January 20, 2024',
    currentLocation: 'Distribution Center - Seattle, WA',
    timeline: [
      {
        date: '2024-01-18',
        time: '14:30',
        status: 'Delivered',
        location: '123 Main St, Anytown, USA',
        description: 'Package delivered successfully',
        completed: true
      },
      {
        date: '2024-01-18',
        time: '08:15',
        status: 'Out for Delivery',
        location: 'Local Delivery Station',
        description: 'Package is out for delivery',
        completed: true
      },
      {
        date: '2024-01-17',
        time: '16:45',
        status: 'In Transit',
        location: 'Regional Distribution Center',
        description: 'Package arrived at regional facility',
        completed: true
      },
      {
        date: '2024-01-16',
        time: '09:20',
        status: 'Shipped',
        location: 'Amazon Fulfillment Center',
        description: 'Package has been shipped',
        completed: true
      },
      {
        date: '2024-01-15',
        time: '11:30',
        status: 'Order Processed',
        location: 'Amazon Order Processing',
        description: 'Order has been processed and prepared for shipment',
        completed: true
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTrackingData(mockTrackingData);
      setLoading(false);
    }, 1000);
  }, [orderId]);

  const getStatusIcon = (status) => {
    const icons = {
      'Order Processed': '📦',
      'Shipped': '🚚',
      'In Transit': '📍',
      'Out for Delivery': '🚚',
      'Delivered': '✅'
    };
    return icons[status] || '📦';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Order Processed': '#6c757d',
      'Shipped': '#ffc107',
      'In Transit': '#17a2b8',
      'Out for Delivery': '#fd7e14',
      'Delivered': '#28a745'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) {
    return (
      <div className={classes.tracking_modal}>
        <div className={classes.modal_content}>
          <div className={classes.loading}>
            <div className={classes.loading_text}>Loading tracking information...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.tracking_modal}>
      <div className={classes.modal_content}>
        <div className={classes.modal_header}>
          <h2>Track Package</h2>
          <button className={classes.close_btn} onClick={onClose}>×</button>
        </div>

        <div className={classes.tracking_summary}>
          <div className={classes.summary_item}>
            <span className={classes.summary_label}>Order ID:</span>
            <span className={classes.summary_value}>{trackingData.orderId}</span>
          </div>
          <div className={classes.summary_item}>
            <span className={classes.summary_label}>Tracking Number:</span>
            <span className={classes.summary_value}>{trackingData.trackingNumber}</span>
          </div>
          <div className={classes.summary_item}>
            <span className={classes.summary_label}>Carrier:</span>
            <span className={classes.summary_value}>{trackingData.carrier}</span>
          </div>
          <div className={classes.summary_item}>
            <span className={classes.summary_label}>Estimated Delivery:</span>
            <span className={classes.summary_value}>{trackingData.estimatedDelivery}</span>
          </div>
          <div className={classes.summary_item}>
            <span className={classes.summary_label}>Current Location:</span>
            <span className={classes.summary_value}>{trackingData.currentLocation}</span>
          </div>
        </div>

        <div className={classes.tracking_timeline}>
          <h3>Tracking Timeline</h3>
          <div className={classes.timeline}>
            {trackingData.timeline.map((event, index) => (
              <div key={index} className={`${classes.timeline_item} ${event.completed ? classes.completed : ''}`}>
                <div className={classes.timeline_marker}>
                  <span className={classes.status_icon}>
                    {getStatusIcon(event.status)}
                  </span>
                </div>
                <div className={classes.timeline_content}>
                  <div className={classes.timeline_header}>
                    <h4 className={classes.timeline_status}
                        style={{ color: getStatusColor(event.status) }}>
                      {event.status}
                    </h4>
                    <span className={classes.timeline_datetime}>
                      {event.date} at {event.time}
                    </span>
                  </div>
                  <div className={classes.timeline_details}>
                    <p className={classes.timeline_description}>{event.description}</p>
                    <p className={classes.timeline_location}>
                      📍 {event.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={classes.tracking_actions}>
          <button className={classes.contact_btn}>
            Contact Carrier
          </button>
          <button className={classes.support_btn}>
            Customer Support
          </button>
        </div>

        <div className={classes.delivery_info}>
          <h4>Delivery Information</h4>
          <div className={classes.info_grid}>
            <div className={classes.info_item}>
              <span className={classes.info_label}>Service:</span>
              <span className={classes.info_value}>Standard Shipping</span>
            </div>
            <div className={classes.info_item}>
              <span className={classes.info_label}>Weight:</span>
              <span className={classes.info_value}>2.5 lbs</span>
            </div>
            <div className={classes.info_item}>
              <span className={classes.info_label}>Dimensions:</span>
              <span className={classes.info_value}>12" x 8" x 4"</span>
            </div>
            <div className={classes.info_item}>
              <span className={classes.info_label}>Insurance:</span>
              <span className={classes.info_value}>Up to $100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
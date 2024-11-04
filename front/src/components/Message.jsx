import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Message.css';

const Message = ({ message }) => {
  return (
    <div className='message-container'>
      <div className='message-spinner'></div>
      <p>{message}</p>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.bool.isRequired,
};

export default Message;

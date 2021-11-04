import React, { useState, useEffect } from 'react';

import './Toast.css';

export const Toast = (props: any) => {
  const { toastList, position, autoDelete, dismissTime } = props;
  const [list, setList] = useState(toastList);

  useEffect(() => {
    setList([...toastList]);
  }, [toastList]);

  const deleteToast = (id: any) => {
    const listItemIndex = list.findIndex((e: any) => e.id === id);
    const toastListItem = toastList.findIndex((e: any) => e.id === id);
    list.splice(listItemIndex, 1);
    toastList.splice(toastListItem, 1);
    setList([...list]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoDelete && toastList.length && list.length) {
        deleteToast(toastList[0].id);
      }
    }, dismissTime);

    return () => {
      clearInterval(interval);
    };

  }, [toastList, autoDelete, dismissTime, list]);

  return (
    <>
      <div className={`notification-container ${position}`}>
        {list.map((toast: any, i: any) => (
          <div
            key={i}
            className={`notification toast ${position}`}
            style={{ backgroundColor: toast.backgroundColor }}
          >
            <button onClick={() => deleteToast(toast.id)}>X</button>
            <div className='notification-image'>
              <img src={toast.icon} alt='' />
            </div>
            <div>
              <p className='notification-title'>{toast.title}</p>
              <p className='notification-message'>{toast.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

"use client";
import React from 'react';
import './styles.css';

type DataRow = {
  nNo: number;
  sName: string;
  nAmount: number;
  isPrint: boolean;
  dRelease: Date;
};

export default function DataTable() {
  const [data, setData] = React.useState<DataRow[]>([
    { nNo: 1, sName: 'PixelBot', nAmount: 10, isPrint: true, dRelease: new Date('2025-08-02') },
    { nNo: 2, sName: 'CodeWizard', nAmount: 5, isPrint: false, dRelease: new Date('2025-08-04') },
    { nNo: 3, sName: 'DataNinja', nAmount: 7, isPrint: true, dRelease: new Date('2025-08-05') },
    { nNo: 4, sName: 'QuantumFox', nAmount: 12, isPrint: false, dRelease: new Date('2025-08-06') },
    { nNo: 5, sName: 'LogicBear', nAmount: 9, isPrint: true, dRelease: new Date('2025-08-07') },
  ]);

  const formattedDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();

    const format = `${day}-${month}-${year}`;
    return format;
  }
  const handleEdit = (nNo: number) => {
    const row = data.find(item => item.nNo === nNo);
    if (row) {
      console.log('Editing row:', row);
      // Implement edit logic here
    }
  };

  const handleDelete = (nNo: number) => {
    const updatedData = data.filter(item => item.nNo !== nNo);
    setData(updatedData);
  };

  return (
    <div>
      <div>
        <h1>รายการข้อมูล</h1>
        <table className='data-table'>
          <thead>
            <tr>
              <th style={{ width: "50px" }}>No</th>
              <th style={{ width: "200px" }}>Name</th>
              <th style={{ width: "50px" }}>Amount</th>
              <th style={{ width: "100px" }}>Status</th>
              <th style={{ width: "100px" }}>Release</th>
              <th style={{ width: "100px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.nNo}>
                <td className='col-center'>{row.nNo}</td>
                <td>{row.sName}</td>
                <td className='col-center'>{row.nAmount}</td>
                <td className='col-center'>
                  {row.isPrint ? 'พิมพ์แล้ว' : 'ยังไม่พิมพ์'}
                </td>
                <td className='col-center'>{formattedDate(row.dRelease)}</td>
                <td className='col-center'>
                  <div className='action-buttons'>
                    <button onClick={() => handleEdit(row.nNo)} className='edit-button'>Edit</button>
                    <button onClick={() => handleDelete(row.nNo)} className='delete-button'>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <hr />
      <h1>Form</h1>
      <form className='data-form'>
        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='sName'>Name:</label>
            <input type='text' id='sName' name='sName' />
          </div>
          <div className='form-group'>
            <label htmlFor='nAmount'>Amount:</label>
            <input type='number' id='nAmount' name='nAmount' />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='isPrint'>Status:</label>
            <div className='form-radio-group'>
              <div className='form-radio'>
                <input type="radio" id="isPrint" name="isPrint" value="1" />
                <label htmlFor="isPrint">พิมพ์แล้ว</label><br />
              </div>
              <div className='form-radio'>
                <input type="radio" id="isPrint" name="isPrint" value="0" />
                <label htmlFor="isPrint">ยังไม่พิมพ์</label>
              </div>
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='dRelease'>Release Date:</label>
            <input type='date' id='dRelease' name='dRelease' />
          </div>
        </div>
        <div className='button-group'>
          <button type='submit'>Submit</button>
          <button type='reset'>Clear</button>
        </div>
      </form>
    </div>
  );
}


"use client";
import React, { useState } from 'react';
import './styles.css';

// กำหนดโครงสร้างของข้อมูลแต่ละแถว
type DataRow = {
  nNo: number;
  sName: string;
  nAmount: number;
  isPrint: boolean;
  dRelease: Date;
  sAuthor: string;
  sCategory: string;
};

export default function DataTable() {
  // สร้าง state สำหรับเก็บข้อมูลทั้งหมด
  const [data, setData] = useState<DataRow[]>([
    { nNo: 1, sName: 'PixelBot', nAmount: 10, isPrint: true, dRelease: new Date('2025-08-02'), sAuthor: 'Alice', sCategory: 'AI' },
    { nNo: 2, sName: 'CodeWizard', nAmount: 5, isPrint: false, dRelease: new Date('2025-08-04'), sAuthor: 'Bob', sCategory: 'DevTools' },
    { nNo: 3, sName: 'DataNinja', nAmount: 7, isPrint: true, dRelease: new Date('2025-08-05'), sAuthor: 'Charlie', sCategory: 'Analytics' },
    { nNo: 4, sName: 'QuantumFox', nAmount: 12, isPrint: false, dRelease: new Date('2025-08-06'), sAuthor: 'David', sCategory: 'Quantum' },
    { nNo: 5, sName: 'LogicBear', nAmount: 9, isPrint: true, dRelease: new Date('2025-08-07'), sAuthor: 'Eve', sCategory: 'Logic' },
  ]);

  // ฟังก์ชันแปลงวันที่ให้อยู่ในรูปแบบ DD-MM-YYYY
  const formattedDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // จัดการ Modal แก้ไขข้อมูล
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<DataRow | null>(null);

  const handleEdit = (nNo: number) => {
    const row = data.find(item => item.nNo === nNo); // ค้นหาข้อมูลที่ต้องการแก้ไข
    if (row) {
      setEditRow(row); // เก็บข้อมูลนั้นลงใน state
      setIsModalOpen(true); // เปิด Modal
    }
  };

  const handleModalSave = () => {
    if (editRow) {
      setData(prev => prev.map(item => item.nNo === editRow.nNo ? editRow : item)); // แก้ไขข้อมูลใน state
      setIsModalOpen(false); // ปิด Modal
    }
  };

  const handleModalClose = () => setIsModalOpen(false); // ปิด Modal แบบไม่บันทึก

  // จัดการ Modal ยืนยันการลบ
  const [deleteRowId, setDeleteRowId] = useState<number | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleDelete = (id: number) => {
    setDeleteRowId(id);
    setIsDeleteConfirmOpen(true); // แสดง Modal ยืนยันลบ
  };

  const confirmDelete = () => {
    if (deleteRowId !== null) {
      setData(prev => prev.filter(row => row.nNo !== deleteRowId)); // ลบข้อมูลจาก state
    }
    setIsDeleteConfirmOpen(false);
    setDeleteRowId(null);
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setDeleteRowId(null);
  };

  // สร้างฟอร์มเพิ่มข้อมูลใหม่
  const [newRow, setNewRow] = useState({
    sName: '',
    nAmount: 0,
    isPrint: true,
    dRelease: '',
    sAuthor: '',
    sCategory: ''
  });

  // เมื่อมีการเปลี่ยนแปลงค่าใน input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewRow(prev => ({
      ...prev,
      [name]: name === 'isPrint'
        ? value === '1'
        : type === 'number'
          ? Number(value)
          : value
    }));
  };

  // บันทึกข้อมูลใหม่เมื่อ Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = data.length > 0 ? Math.max(...data.map(d => d.nNo)) + 1 : 1;

    const newItem: DataRow = {
      nNo: nextId,
      sName: newRow.sName,
      nAmount: newRow.nAmount,
      isPrint: newRow.isPrint,
      dRelease: new Date(newRow.dRelease),
      sAuthor: newRow.sAuthor,
      sCategory: newRow.sCategory
    };

    setData(prev => [...prev, newItem]); // เพิ่มข้อมูลใหม่ลงใน state
    // เคลียร์ฟอร์ม
    setNewRow({ sName: '', nAmount: 0, isPrint: true, dRelease: '', sAuthor: '', sCategory: '' });
  };

  return (
    <div>
      <h1 className='table'>รายการข้อมูล</h1>
      <table className='data-table'>
        <thead>
          <tr>
            <th>No</th><th>Title</th><th>Price</th><th>In Stock</th>
            <th>Publish Date</th><th>Author</th><th>Category</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.nNo}>
              <td className='col-center'>{row.nNo}</td>
              <td>{row.sName}</td>
              <td className='col-center'>{row.nAmount}</td>
              <td className={`col-center ${row.isPrint ? 'status-printed' : 'status-unprinted'}`}>
                {row.isPrint ? 'พิมพ์แล้ว' : 'ยังไม่พิมพ์'}
              </td>
              <td className='col-center'>{formattedDate(row.dRelease)}</td>
              <td>{row.sAuthor}</td>
              <td>{row.sCategory}</td>
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

      {/* Modal แก้ไขข้อมูล */}
      {isModalOpen && editRow && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Row #{editRow.nNo}</h2>
            <div className='edit-form-text'>
              <div className='edit-form-row'>
                <label>Name:</label>
                <input type="text" value={editRow.sName} onChange={(e) => setEditRow({ ...editRow, sName: e.target.value })} />
                <label>Amount:</label>
                <input type="number" value={editRow.nAmount} onChange={(e) => setEditRow({ ...editRow, nAmount: Number(e.target.value) })} />
              </div>
              <div className='edit-form-row'>
                <label>Author:</label>
                <input type="text" value={editRow.sAuthor} onChange={(e) => setEditRow({ ...editRow, sAuthor: e.target.value })} />
                <label>Category:</label>
                <input type="text" value={editRow.sCategory} onChange={(e) => setEditRow({ ...editRow, sCategory: e.target.value })} />
              </div>
              <div className='edit-form-radio'>
                <label>Status:</label>
                <div className='edit-radio-group'>
                  <input type="radio" name="status" checked={editRow.isPrint === true} onChange={() => setEditRow({ ...editRow, isPrint: true })} /> พิมพ์แล้ว
                  <input type="radio" name="status" checked={editRow.isPrint === false} onChange={() => setEditRow({ ...editRow, isPrint: false })} /> ยังไม่พิมพ์
                </div>
              </div>
              <div className='edit-form-date'>
                <label>Release Date:</label>
                <input type="date" value={editRow.dRelease.toISOString().substring(0, 10)} onChange={(e) => setEditRow({ ...editRow, dRelease: new Date(e.target.value) })} />
              </div>
              <div className='edit-button-group'>
                <button onClick={handleModalSave} className='edit-save'>Save</button>
                <button onClick={handleModalClose} className='edit-cancel'>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal ยืนยันลบข้อมูล */}
      {isDeleteConfirmOpen && (
        <div className="modal">
          <div className="delete-modal-content">
            <h2>ยืนยันการลบ</h2>
            <p>คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้ ?</p>
            <div className="delete-button-group">
              <button onClick={cancelDelete} className='cancel-button'>ยกเลิก</button>
              <button onClick={confirmDelete} className='confirm-button'>ลบ</button>
            </div>
          </div>
        </div>
      )}

      <hr />

      {/* แบบฟอร์มเพิ่มข้อมูลใหม่ */}
      <h1 className='form'>เพิ่มรายการ</h1>
      <form className='data-form' onSubmit={handleSubmit}>
        <div className='form-row'>
          <div className='form-group'>
            <label>Title:</label>
            <input type='text' name='sName' value={newRow.sName} onChange={handleInputChange} required />
          </div>
          <div className='form-group'>
            <label>Price:</label>
            <input type='number' name='nAmount' value={newRow.nAmount} onChange={handleInputChange} required min={0} />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-group'>
            <label>In Stock:</label>
            <div className='form-radio-group'>
              <label><input type="radio" name="isPrint" value="1" checked={newRow.isPrint === true} onChange={handleInputChange} /> พิมพ์แล้ว</label>
              <label><input type="radio" name="isPrint" value="0" checked={newRow.isPrint === false} onChange={handleInputChange} /> ยังไม่พิมพ์</label>
            </div>
          </div>
          <div className='form-group'>
            <label>Publish Date:</label>
            <input type='date' name='dRelease' value={newRow.dRelease} onChange={handleInputChange} required />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-group'>
            <label>Author:</label>
            <input type='text' name='sAuthor' value={newRow.sAuthor} onChange={handleInputChange} required />
          </div>
          <div className='form-group'>
            <label>Category:</label>
            <input type='text' name='sCategory' value={newRow.sCategory} onChange={handleInputChange} required />
          </div>
        </div>
        <div className='button-group'>
          <button type='submit'>Submit</button>
          <button type='reset' onClick={() => setNewRow({ sName: '', nAmount: 0, isPrint: true, dRelease: '', sAuthor: '', sCategory: '' })}>Clear</button>
        </div>
      </form>
    </div>
  );
}

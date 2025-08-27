"use client";
import React, { useState, useEffect } from 'react';
import './styles.css';
import axios from 'axios';

// โครงสร้างข้อมูลในตาราง
type DataRow = {
  nNo: number;
  sName: string;
  nAmount: number;
  isPrint: boolean;
  dRelease: Date;
  sAuthor: string;
  sCategory: string;
};

// โครงสร้างข้อมูลในฟอร์มเพิ่มรายการ
type NewRow = {
  sName: string;
  nAmount: string;   // เก็บเป็น string เพื่อควบคุมการพิมพ์/ลบเลข 0 นำหน้า
  isPrint: boolean;
  dRelease: string;  // YYYY-MM-DD
  sAuthor: string;
  sCategory: string;
};

// โครงสร้างข้อความ error ของแต่ละช่อง
type Errors = {
  sName?: string;
  nAmount?: string;
  dRelease?: string;
  sAuthor?: string;
  sCategory?: string;
};

export default function DataTable() {
  const [data, setData] = useState<DataRow[]>([]);
  const [authors, setAuthors] = useState<{ nAutherID: number, sName: string }[]>([]);
  const [categories, setCategories] = useState<{ nCategoryID: number, sName: string }[]>([]);

  // helper แปลง Date เป็น dd/mm/yyyy พ.ศ.
  const formatDateBE = (date: Date | string) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const yearBE = d.getFullYear() + 543;
    return `${day}/${month}/${yearBE}`;
  };

  // ดึงข้อมูลจาก backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7234/Book/OnloadData");
        if (response.data && Array.isArray(response.data.objResult)) {
          const mappedData: DataRow[] = response.data.objResult.map((item: any, index: number) => {
            let releaseDate: Date;
            if (item.nPublishDate) {
              const temp = new Date(item.nPublishDate);
              releaseDate = isNaN(temp.getTime()) ? new Date() : temp;
            } else {
              releaseDate = new Date();
            }

            return {
              nNo: index + 1,
              sName: item.sTitle,
              nAmount: item.nPrice,
              isPrint: item.nStock,
              dRelease: releaseDate,
              sAuthor: item.sAuthorName,
              sCategory: item.sCategoryName
            };
          });
          setData(mappedData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDropdown = async () => {
      try {
        const resAuthors = await axios.get("https://localhost:7234/Book/GetAuthors");
        setAuthors(resAuthors.data);

        const resCategories = await axios.get("https://localhost:7234/Book/GetCategories");
        setCategories(resCategories.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchDropdown();
  }, []);

  // ===== Modal แก้ไขข้อมูล =====
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<DataRow | null>(null);

  const handleEdit = (nNo: number) => {
    const row = data.find(item => item.nNo === nNo);
    if (row) {
      setEditRow(row);
      setIsModalOpen(true);
    }
  };

  const handleModalSave = async () => {
    if (editRow) {
      try {
        const payload = {
          nBookID: editRow.nNo,   // ต้องแก้ Backend ให้รับ id จริง
          sTitle: editRow.sName,
          nPrice: editRow.nAmount,
          nStock: editRow.isPrint,
          nPublishDate: editRow.dRelease instanceof Date
            ? editRow.dRelease.toISOString().substring(0, 10)
            : editRow.dRelease,
          sAuthorName: editRow.sAuthor,
          sCategoryName: editRow.sCategory
        };

        const response = await axios.put("https://localhost:7234/Book/Edit", payload);

        if (response.data.nStatusCode === 200) {
          alert("แก้ไขข้อมูลสำเร็จ ");
          setData(prev => prev.map(item => item.nNo === editRow.nNo ? editRow : item));
          setIsModalOpen(false);
        } else {
          alert("เกิดข้อผิดพลาด: " + response.data.sMessage);
        }
      } catch (error) {
        console.error(error);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับ server ");
      }
    }
  };

  const handleModalClose = () => setIsModalOpen(false);

  // ===== Modal ยืนยันลบ =====
  const [deleteRowId, setDeleteRowId] = useState<number | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleDelete = (id: number) => {
    setDeleteRowId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteRowId !== null) {
      try {
        const response = await axios.delete(`https://localhost:7234/Book/Delete?id=${deleteRowId}`);
        if (response.data.nStatusCode === 200) {
          setData(prev => prev.filter(row => row.nNo !== deleteRowId));
          alert("ลบสำเร็จ!");
        } else {
          alert("เกิดข้อผิดพลาด: " + response.data.sMessage);
        }
      } catch (error: any) {
        console.error(error);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับ server");
      }
    }
    setIsDeleteConfirmOpen(false);
    setDeleteRowId(null);
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setDeleteRowId(null);
  };

  // ===== ฟอร์มเพิ่มข้อมูลใหม่ + validation =====
  const [newRow, setNewRow] = useState<NewRow>({
    sName: '',
    nAmount: '',
    isPrint: true,
    dRelease: '',
    sAuthor: '',
    sCategory: ''
  });

  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let nextValue: string | boolean = value;

    if (name === 'isPrint') {
      nextValue = value === '1';
    } else if (name === 'nAmount') {
      let v = value;
      if (v.startsWith('0')) v = v.replace(/^0+/, '');
      if (v === '-') v = '';
      nextValue = v;
    }

    setNewRow(prev => ({ ...prev, [name]: nextValue }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    // --- ตรวจ Title ---
    if (!newRow.sName.trim()) {
      newErrors.sName = 'กรุณากรอก Title';
    } else if (data.some(item =>
      item.sName.toLowerCase() === newRow.sName.trim().toLowerCase() &&
      item.sAuthor.toLowerCase() === newRow.sAuthor.trim().toLowerCase() &&
      item.sCategory.toLowerCase() === newRow.sCategory.trim().toLowerCase()
    )) {
      newErrors.sName = 'รายการนี้ซ้ำกับที่มีอยู่แล้ว';
    }

    // --- ตรวจ Price ---
    if (!newRow.nAmount.trim()) {
      newErrors.nAmount = 'กรุณากรอก Price';
    } else if (Number(newRow.nAmount) <= 0) {
      newErrors.nAmount = 'กรุณากรอก Price มากกว่า 0';
    }

    // --- ตรวจ Publish Date ---
    if (!newRow.dRelease) {
      newErrors.dRelease = 'กรุณาเลือก Publish Date';
    }

    // --- ตรวจ Author ---
    if (!newRow.sAuthor.trim()) {
      newErrors.sAuthor = 'กรุณาเลือก Author';
    }

    // --- ตรวจ Category ---
    if (!newRow.sCategory.trim()) {
      newErrors.sCategory = 'กรุณาเลือก Category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      sTitle: newRow.sName.trim(),
      nPrice: Number(newRow.nAmount),
      nStock: newRow.isPrint,
      nPublishDate: new Date(newRow.dRelease).toISOString().substring(0, 10),
      sAuthorName: newRow.sAuthor,
      sCategoryName: newRow.sCategory
    };

    try {
      const response = await axios.post("https://localhost:7234/Book/Create", payload);
      if (response.data.nStatusCode === 200) {
        const nextId = data.length > 0 ? Math.max(...data.map(d => d.nNo)) + 1 : 1;
        const newItem: DataRow = {
          nNo: nextId,
          sName: newRow.sName,
          nAmount: Number(newRow.nAmount),
          isPrint: newRow.isPrint,
          dRelease: new Date(newRow.dRelease),
          sAuthor: newRow.sAuthor,
          sCategory: newRow.sCategory
        };
        setData(prev => [...prev, newItem]);
        setNewRow({ sName: '', nAmount: '', isPrint: true, dRelease: '', sAuthor: '', sCategory: '' });
        setErrors({});
        alert("บันทึกสำเร็จ!");
      } else {
        alert("เกิดข้อผิดพลาด: " + response.data.sMessage);
      }
    } catch (error: any) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับ server");
    }
  };

  return (
    <div>
      <div className='input-data'>
        <h1 className='table'>รายการข้อมูล</h1>
        <table className='data-table'>
          <thead>
            <tr>
              <th>No</th>
              <th>Title</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Publish Date</th>
              <th>Author</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.map(row => (
              <tr key={row.nNo}>
                <td className='col-center'>{row.nNo}</td>
                <td>{row.sName}</td>
                <td className='col-center'>{row.nAmount}</td>
                <td className={`col-center ${row.isPrint ? 'status-printed' : 'status-unprinted'}`}>
                  {row.isPrint ? 'In Stock' : 'Out Stock'}
                </td>
                <td className='col-center'>{formatDateBE(row.dRelease)}</td>
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
                  <label className='label-edit'>Name:</label>
                  <input type="text" value={editRow.sName} onChange={(e) => setEditRow({ ...editRow, sName: e.target.value })} />
                  <label className='label-edit'>Amount:</label>
                  <input type="number" value={editRow.nAmount} onChange={(e) => setEditRow({ ...editRow, nAmount: Number(e.target.value) })} min={0} />
                </div>
                <div className='edit-form-row'>
                  <label className='label-edit'>Author:</label>
                  <select value={editRow.sAuthor} onChange={(e) => setEditRow({ ...editRow, sAuthor: e.target.value })}>
                    <option value=''>-- เลือก Author --</option>
                    {authors.map(a => <option key={a.nAutherID} value={a.sName}>{a.sName}</option>)}
                  </select>
                  <label className='label-edit'>Category:</label>
                  <select value={editRow.sCategory} onChange={(e) => setEditRow({ ...editRow, sCategory: e.target.value })}>
                    <option value=''>-- เลือก Category --</option>
                    {categories.map(c => <option key={c.nCategoryID} value={c.sName}>{c.sName}</option>)}
                  </select>
                </div>
                <div className='edit-form-radio'>
                  <label className='label-edit'>Stock:</label>
                  <div className='edit-radio-group'>
                    <input type="radio" name="status" checked={editRow.isPrint === true} onChange={() => setEditRow({ ...editRow, isPrint: true })} /> In Stock
                    <input type="radio" name="status" checked={editRow.isPrint === false} onChange={() => setEditRow({ ...editRow, isPrint: false })} /> Out Stock
                  </div>
                </div>
                <div className='edit-form-date'>
                  <label className='label-edit'>Release Date:</label>
                  <input type="date" value={editRow.dRelease ? new Date(editRow.dRelease).toISOString().split("T")[0] : ""} onChange={(e) => setEditRow({ ...editRow, dRelease: new Date(e.target.value) })} />
                </div>
                <div className='edit-button-group'>
                  <button onClick={handleModalSave} className='edit-save'>Save</button>
                  <button onClick={handleModalClose} className='edit-cancel'>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal ยืนยันลบ */}
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

        {/* ฟอร์มเพิ่มข้อมูลใหม่ */}
        <h1 className='form'>เพิ่มรายการ</h1>
        <form className='data-form' onSubmit={handleSubmit} noValidate>
          <div className='form-row'>
            <div className='form-group'>
              <label>Title:</label>
              <input type='text' name='sName' value={newRow.sName} onChange={handleInputChange} />
              {errors.sName && <div style={{ color: 'red', fontSize: '12px', marginTop: 4 }}>{errors.sName}</div>}
            </div>

            <div className='form-group'>
              <label>Price:</label>
              <input type="number" name="nAmount" value={newRow.nAmount} onChange={handleInputChange} min={0} />
              {errors.nAmount && <div style={{ color: 'red', fontSize: '12px', marginTop: 4 }}>{errors.nAmount}</div>}
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label>Stock:</label>
              <div className='form-radio-group'>
                <label>
                  <input type="radio" name="isPrint" value="1" checked={newRow.isPrint === true} onChange={handleInputChange} /> In Stock
                </label>
                <label>
                  <input type="radio" name="isPrint" value="0" checked={newRow.isPrint === false} onChange={handleInputChange} /> Out Stock
                </label>
              </div>
            </div>

            <div className='form-group'>
              <label>Publish Date:</label>
              <input type='date' name='dRelease' value={newRow.dRelease} onChange={handleInputChange} />
              {errors.dRelease && <div style={{ color: 'red', fontSize: '12px', marginTop: 4 }}>{errors.dRelease}</div>}
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label>Author:</label>
              <select name='sAuthor' value={newRow.sAuthor} onChange={handleInputChange}>
                <option value=''>-- เลือก Author --</option>
                {authors.map(a => <option key={a.nAutherID} value={a.sName}>{a.sName}</option>)}
              </select>
              {errors.sAuthor && <div style={{ color: 'red', fontSize: '12px', marginTop: 4 }}>{errors.sAuthor}</div>}
            </div>

            <div className='form-group'>
              <label>Category:</label>
              <select name='sCategory' value={newRow.sCategory} onChange={handleInputChange}>
                <option value=''>-- เลือก Category --</option>
                {categories.map(c => <option key={c.nCategoryID} value={c.sName}>{c.sName}</option>)}
              </select>
              {errors.sCategory && <div style={{ color: 'red', fontSize: '12px', marginTop: 4 }}>{errors.sCategory}</div>}
            </div>
          </div>

          <div className='button-group'>
            <button type='submit'>Submit</button>
            <button type='reset' onClick={() => { setNewRow({ sName: '', nAmount: '', isPrint: true, dRelease: '', sAuthor: '', sCategory: '' }); setErrors({}); }}>Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
}

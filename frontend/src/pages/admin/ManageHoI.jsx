import React, {useRef, useEffect} from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout';

const ManageHoI = () => {
    document.title = 'Manage HoI';
    const [confirmAdd, setConfirmAdd] = React.useState(false);
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const [addError, setAddError] = React.useState('');
    const [deleteError, setDeleteError] = React.useState('');
    const [formAddData, setFormAddData] = React.useState({
        id: '',
        email: '',
        campus: '',
    });
    const [formDeleteData, setFormDeleteData] = React.useState({
        id: '',
        email: '',
        campus: '',
    });
    const addRef = useRef(null);
    const deleteRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
          if (addRef.current && !addRef.current.contains(event.target)) {
            setConfirmAdd(false);
          }
          if (deleteRef.current && !deleteRef.current.contains(event.target)) {
            setConfirmDelete(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const validateID = (value) => {
        if (value && !value.match(/^[a-zA-Z0-9]+$/)) {
          return false;
        }
        return true;
    };
      
    const validategitamEmail = (value) => {
        if (
          !value.includes("@") ||
          !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ||
          value.startsWith(".") ||
          value.endsWith(".") ||
          value.includes("..") ||
          !value.endsWith("@gitam.edu")
        ) {
            return false;
        }
            return true;
    };

    const handleInputOnChangeAdd = (e) => {
        setFormAddData({
            ...formAddData,
            [e.target.name]: e.target.value,
        });
    }

    const handleInputOnChangeDelete = (e) => {
        setFormDeleteData({
            ...formDeleteData,
            [e.target.name]: e.target.value,
        });
    }

    const handleAdd = () => {
        if (formAddData.id === '' || formAddData.email === '') {
            setAddError('Please fill all the fields');
            return;
        }
        if (!validateID(formAddData.id)) {
            setAddError('Invalid Employee ID');
            return;
        }
        if (!validategitamEmail(formAddData.email)) {
            setAddError('Invalid Email ID');
            return;
        }
        if (formAddData.campus === '') {
            setAddError('Please select a campus');
            return;
        }
        setAddError('');
        setConfirmAdd(true);
    }

    const handleDelete = () => {
        if (formDeleteData.id === '' || formDeleteData.email === '' || formDeleteData.campus === '') {
            setDeleteError('Please fill all the fields');
            return;
        }
        if (!validateID(formDeleteData.id)) {
            setDeleteError('Invalid Employee ID');
            return;
        }
        if (!validategitamEmail(formDeleteData.email)) {
            setDeleteError('Invalid Email ID');
            return;
        }
        if (formDeleteData.campus === '') {
            setDeleteError('Please select a campus');
            return;
        }
        setDeleteError('');
        setConfirmDelete(true);
    }

    const handleSubmitAddHoI = () => {
        // API call to add HoI
        console.log("HoI Added:", formAddData);
        setConfirmAdd(false);
    }

    const handleSubmitDeleteHoI = () => {
        // API call to delete HoI
        console.log("HoI Deletion Request Submitted:", formDeleteData);
        setConfirmDelete(false);
    }

    return (
        <DashboardLayout>
            <h2 className='header-container'>Add/Delete Head of Institutes</h2>
            <div className='admin-form-whole'>
                <div className='admin-form'>
                    <h3>Add HoI</h3>
                    <span className='error'>{addError}</span>
                    <label className='labels'>Employee ID<span className='required' style={{color:'red', marginLeft: '2px'}}>*</span></label>
                    <input type='text' className='credentials' name='id' value={formAddData.id} onChange={handleInputOnChangeAdd} placeholder='Enter Employee ID'/>
                    <label className='labels'>Email ID<span className='required' style={{color:'red', marginLeft: '2px'}}>*</span></label>
                    <input type='email' className='credentials' name='email' value={formAddData.email} onChange={handleInputOnChangeAdd} placeholder='Enter Email ID'/>
                    <label className='labels'>Campus<span className='required' style={{color:'red', marginLeft: '2px'}}>*</span></label>
                    <select
                        className="credentials"
                        name="campus"
                        value={formAddData.campus}
                        onChange={handleInputOnChangeAdd}
                    >
                        <option value="">--Select Campus--</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Vishakhapatnam">Vishakhapatnam</option>
                    </select>
                    <button className='submit-btn' onClick={handleAdd} style={{marginTop: '30px', marginBottom:'30px', padding: '15px 25px', minWidth:'100%'}}>Add HoI</button>
                </div>
                <div className='admin-form'>
                    <h3>Delete HoI</h3>
                    <span className='error'>{deleteError}</span>
                    <label className='labels'>Employee ID<span className='required' style={{color:'red', marginLeft: '2px'}}>*</span></label>
                    <input type='text' className='credentials' name='id' value={formDeleteData.id} onChange={handleInputOnChangeDelete} placeholder='Enter Employee ID' required/>
                    <label className='labels'>Email ID<span className='required' style={{color:'red', marginLeft: '2px'}}>*</span></label>
                    <input type='email' className='credentials' name='email' value={formDeleteData.email} onChange={handleInputOnChangeDelete} placeholder='Enter Email ID' required/>
                    <label className='labels'>Campus<span className='required' style={{color:'red', marginLeft: '2px'}}>*</span></label>
                    <select
                        className="credentials"
                        name="campus"
                        value={formDeleteData.campus}
                        onChange={handleInputOnChangeDelete}
                    >
                        <option value="">--Select Campus--</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Vishakhapatnam">Vishakhapatnam</option>
                    </select>
                    <button className='submit-btn delete' onClick={handleDelete} style={{marginTop: '30px', marginBottom:'30px', padding: '15px 25px', minWidth:'100%'}}>Delete HoI</button>
                </div>
            </div>
            {confirmAdd && (
                <div className="confirm-delete" ref={addRef}>
                    <p>Are you sure you want to ADD {formAddData.empId} as HoI for {formAddData.campus}?</p>
                    <div className='confirm-delete-buttons'>
                        <button onClick={() => setConfirmAdd(false)} className='buttons cancel'>No, Cancel</button>
                        <button className='buttons delete' style={{backgroundColor:'var(--primary-color)'}} onClick={handleSubmitAddHoI}>YES,Submit Request</button>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className="confirm-delete" ref={deleteRef}>
                    <p>Are you sure you want to DELETE {formAddData.empId} as HoI for {formAddData.campus}?</p>
                    <div className='confirm-delete-buttons'>
                        <button onClick={() => setConfirmDelete(false)} className='buttons cancel'>Cancel</button>
                        <button className='buttons delete' onClick={handleSubmitDeleteHoI}>Yes, Submit request</button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

export default ManageHoI;
    
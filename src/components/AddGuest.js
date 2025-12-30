import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const AddGuest = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailId, setEmailId] = useState(''); // 인원수 (백엔드 필드명에 따라 count 등으로 매핑)
    const [phone, setPhone] = useState(''); // 회의실 이름 + 시간

    const navigate = useNavigate();
    const { id } = useParams();
    const API_URL = "/api/guests";

    const saveOrUpdateGuest = (e) => {
        e.preventDefault();
        
        // 백엔드로 보낼 데이터 객체
        const guest = { firstName, lastName, emailId, phone };

        if (id) {
            fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(guest)
            }).then(() => navigate('/'));
        } else {
            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(guest)
            }).then(() => navigate('/'));
        }
    }

    useEffect(() => {
        if (id) {
            fetch(`${API_URL}/${id}`)
                .then(res => res.json())
                .then(data => {
                    setFirstName(data.firstName);
                    setLastName(data.lastName);
                    setEmailId(data.emailId);
                    setPhone(data.phone);
                })
                .catch(error => console.log(error));
        }
    }, [id]);

    const title = () => {
        return id ? <h2 className="text-center">예약 수정</h2> : <h2 className="text-center">새 회의실 예약</h2>
    }

    return (
        <div>
            <div className="container" style={{marginTop: "30px"}}>
                <div className="row">
                    <div className="card col-md-6 offset-md-3 offset-md-3">
                        {title()}
                        <div className="card-body">
                            <form>
                                <div className="form-group mb-2">
                                    <label className="form-label"> 부서명 (First Name) </label>
                                    <input type="text" placeholder="예: 마케팅팀" name="firstName" className="form-control" 
                                           value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="form-group mb-2">
                                    <label className="form-label"> 신청자명 (Last Name) </label>
                                    <input type="text" placeholder="예: 김대리" name="lastName" className="form-control" 
                                           value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                                <div className="form-group mb-2">
                                    <label className="form-label"> 참석 인원 (숫자) </label>
                                    <input type="number" placeholder="예: 4" name="emailId" className="form-control" 
                                           value={emailId} onChange={(e) => setEmailId(e.target.value)} />
                                </div>
                                {/* 여기가 핵심: 전화번호 필드를 회의실 정보 입력칸으로 둔갑시킴 */}
                                <div className="form-group mb-2">
                                    <label className="form-label"> 📅 회의실 및 시간 </label>
                                    <input type="text" placeholder="예: 대회의실 A (14:00)" name="phone" className="form-control" 
                                           value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    <small className="text-muted">원하는 회의실 이름과 시간을 함께 적어주세요.</small>
                                </div>
                                <button className="btn btn-success" onClick={(e) => saveOrUpdateGuest(e)}>저장</button>
                                <Link to="/" className="btn btn-danger" style={{marginLeft: "10px"}}>취소</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddGuest;

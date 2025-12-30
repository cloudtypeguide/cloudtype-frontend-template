import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const AddGuest = () => {
    const [firstName, setFirstName] = useState(''); // 부서명
    const [lastName, setLastName] = useState('');   // 신청자명
    const [emailId, setEmailId] = useState('');     // 인원수
    const [phone, setPhone] = useState('');         // 회의실 및 시간

    const navigate = useNavigate();
    const { id } = useParams();
    
    // 환경변수 적용
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
    const API_URL = `${BASE_URL}/api/guests`;

    const saveOrUpdateGuest = (e) => {
        e.preventDefault();
        
        // 백엔드로 보낼 데이터 객체 구성
        const guest = { firstName, lastName, emailId, phone };

        const requestOptions = {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guest)
        };

        const url = id ? `${API_URL}/${id}` : API_URL;

        fetch(url, requestOptions)
            .then(() => navigate('/'))
            .catch(error => console.log(error));
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
    }, [id, API_URL]);

    const title = () => {
        return id ? <h2 className="text-center mb-4">예약 정보 수정</h2> : <h2 className="text-center mb-4">새 회의실 예약</h2>
    }

    return (
        <div>
            <div className="container" style={{marginTop: "50px"}}>
                <div className="row">
                    <div className="card col-md-6 offset-md-3 shadow">
                        <div className="card-body">
                            {title()}
                            <form>
                                <div className="form-group mb-3">
                                    <label className="form-label fw-bold"> 부서명 </label>
                                    <input type="text" placeholder="예: 마케팅팀" name="firstName" className="form-control" 
                                           value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label fw-bold"> 신청자 성함 </label>
                                    <input type="text" placeholder="예: 김철수 대리" name="lastName" className="form-control" 
                                           value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label fw-bold"> 참석 인원 </label>
                                    <input type="number" placeholder="숫자만 입력 (예: 4)" name="emailId" className="form-control" 
                                           value={emailId} onChange={(e) => setEmailId(e.target.value)} />
                                </div>
                                <div className="form-group mb-4">
                                    <label className="form-label fw-bold"> 📅 회의실 및 시간 </label>
                                    <input type="text" placeholder="예: 대회의실 A (14:00~16:00)" name="phone" className="form-control" 
                                           value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    <small className="text-muted">원하는 회의실과 시간을 함께 적어주세요.</small>
                                </div>
                                <div className="d-grid gap-2">
                                    <button className="btn btn-success" onClick={(e) => saveOrUpdateGuest(e)}>저장하기</button>
                                    <Link to="/" className="btn btn-secondary">취소</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddGuest;

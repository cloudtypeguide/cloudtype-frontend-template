import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const AddGuest = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailId, setEmailId] = useState('');
    const [phone, setPhone] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();
    
    // 1. 사용자님이 설정한 변수명으로 매칭
    const ENV_URL = process.env.REACT_APP_WAITLIST_API_URL;
    
    // 2. 주소 결정 로직 (중복 경로 방지)
    const API_URL = ENV_URL || "http://localhost:8080/api/guests";

    const saveOrUpdateGuest = (e) => {
        e.preventDefault();
        
        console.log("🔍 [환경변수 값 확인] REACT_APP_WAITLIST_API_URL =", ENV_URL);
        console.log("🌐 [전송 주소] URL =", API_URL);

        const guest = { firstName, lastName, emailId, phone };

        const requestOptions = {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guest)
        };

        const url = id ? `${API_URL}/${id}` : API_URL;

        fetch(url, requestOptions)
            .then(response => {
                if(!response.ok) throw new Error(`HTTP Error: ${response.status}`);
                return response.text().then(text => text ? JSON.parse(text) : {});
            })
            .then(() => {
                alert("✅ 예약 성공!");
                navigate('/');
            })
            .catch(error => {
                console.error("❌ 에러 발생:", error);
                alert(`저장 실패!\n\n현재 요청 주소: ${url}\n(F12 콘솔 로그를 확인하세요)`);
            });
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
        return id ? <h2 className="text-center mb-4">예약 수정</h2> : <h2 className="text-center mb-4">새 회의실 예약</h2>
    }

    return (
        <div className="container" style={{marginTop: "50px"}}>
            <div className="row">
                <div className="card col-md-6 offset-md-3 shadow">
                    <div className="card-body">
                        {title()}
                        <form>
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold"> 부서명 </label>
                                <input type="text" placeholder="예: 개발팀" name="firstName" className="form-control" 
                                       value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold"> 신청자 </label>
                                <input type="text" placeholder="예: 홍길동" name="lastName" className="form-control" 
                                       value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold"> 인원 </label>
                                <input type="number" placeholder="예: 4" name="emailId" className="form-control" 
                                       value={emailId} onChange={(e) => setEmailId(e.target.value)} />
                            </div>
                            <div className="form-group mb-4">
                                <label className="form-label fw-bold"> 회의실 및 시간 </label>
                                <input type="text" placeholder="예: A회의실 (14:00)" name="phone" className="form-control" 
                                       value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <button className="btn btn-success" onClick={(e) => saveOrUpdateGuest(e)}>저장</button>
                            <Link to="/" className="btn btn-secondary ms-2">취소</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddGuest;

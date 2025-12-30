import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const AddGuest = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailId, setEmailId] = useState('');
    const [phone, setPhone] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();
    
    // 🔴 [수정] 무조건 작동하는 주소 직접 입력
    const API_URL = "https://port-0-cloudtype-backend-template-mg2vve8668cb34cb.sel3.cloudtype.app/api/guests";

    const saveOrUpdateGuest = (e) => {
        e.preventDefault();
        
        console.log("🌐 전송 주소:", API_URL);

        // 🚨 [500 에러 방지] 
        // 백엔드 DB가 허용하는 길이(보통 15~20자)에 맞춰서 강제로 자릅니다.
        // 글자를 줄였다고 해도, 혹시 모르니 안전장치를 겁니다.
        const safePhone = phone.length > 20 ? phone.substring(0, 20) : phone;

        // 숫자인지 문자인지 헷갈리는 인원수 필드도 안전하게 처리
        const safeEmailId = String(emailId); 

        const guest = { 
            firstName, 
            lastName, 
            emailId: safeEmailId, 
            phone: safePhone 
        };

        const requestOptions = {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guest)
        };

        const url = id ? `${API_URL}/${id}` : API_URL;

        fetch(url, requestOptions)
            .then(response => {
                if(!response.ok) {
                    // 에러가 나면 여기서 잡힘 (500 에러 등)
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                return response.text().then(text => text ? JSON.parse(text) : {});
            })
            .then(() => {
                alert("✅ 예약 성공!");
                navigate('/');
            })
            .catch(error => {
                console.error("❌ 에러 발생:", error);
                alert(`저장 실패!\n\n1. 주소 확인: ${API_URL}\n2. 에러 내용: ${error.message}\n(F12 콘솔을 확인해주세요)`);
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
    }, [id]);

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
                                <input type="text" placeholder="예: A룸 (14시)" name="phone" className="form-control" 
                                       value={phone} onChange={(e) => setPhone(e.target.value)} />
                                <small className="text-muted">최대 20자까지만 저장됩니다.</small>
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

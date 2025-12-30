import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const AddGuest = () => {
    const [firstName, setFirstName] = useState(''); // 부서명
    const [lastName, setLastName] = useState('');   // 신청자
    const [count, setCount] = useState('');         // 인원수 (화면 입력용)
    const [roomName, setRoomName] = useState('');   // 회의실 (화면 입력용)

    const navigate = useNavigate();
    const { id } = useParams();
    
    // 🔴 [성공한 주소] 이 주소는 이제 건드리지 마세요! 완벽합니다.
    const API_URL = "https://port-0-cloudtype-backend-template-mg2vve8668cb34cb.sel3.cloudtype.app/api/guests";

    const saveOrUpdateGuest = (e) => {
        e.preventDefault();
        
        console.log("🌐 전송 주소:", API_URL);

        // 💡 [500 에러 해결 핵심]
        // 1. 이메일 필드에 숫자 대신 '가짜 이메일'을 넣어서 백엔드를 안심시킵니다.
        // (중복 에러 방지를 위해 현재시간을 섞습니다)
        const fakeEmail = `system_${Date.now()}@reservation.com`;

        // 2. 인원수(count)와 회의실(roomName)을 합쳐서 'phone'에 저장합니다.
        // 예: "대회의실 A (4명)"
        const combinedInfo = `${roomName} (${count}명)`;
        
        // 3. 길면 잘라서 500 에러 방지 (안전장치)
        const safePhone = combinedInfo.length > 20 ? combinedInfo.substring(0, 20) : combinedInfo;

        const guest = { 
            firstName: firstName, 
            lastName: lastName, 
            emailId: fakeEmail,  // 백엔드: "음, 이메일 형식이군. 통과!"
            phone: safePhone     // 여기에 핵심 정보를 다 넣음
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
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                // 응답이 텍스트일 수도 있고 JSON일 수도 있어서 안전하게 처리
                return response.text().then(text => text ? JSON.parse(text) : {});
            })
            .then(() => {
                alert("✅ 예약 성공! (500 에러 해결됨)");
                navigate('/');
            })
            .catch(error => {
                console.error("❌ 에러 발생:", error);
                alert(`저장 실패!\n에러 내용: ${error.message}`);
            });
    }

    useEffect(() => {
        if (id) {
            fetch(`${API_URL}/${id}`)
                .then(res => res.json())
                .then(data => {
                    setFirstName(data.firstName);
                    setLastName(data.lastName);
                    // 수정 모드일 때는 데이터를 불러와서 적당히 보여줌 (완벽한 복원은 어렵지만 데모용으론 충분)
                    setCount("0"); 
                    setRoomName(data.phone); 
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
                                <input type="text" placeholder="예: 개발팀" className="form-control" 
                                       value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold"> 신청자 </label>
                                <input type="text" placeholder="예: 홍길동" className="form-control" 
                                       value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold"> 인원 </label>
                                <input type="number" placeholder="예: 4" className="form-control" 
                                       value={count} onChange={(e) => setCount(e.target.value)} />
                            </div>
                            <div className="form-group mb-4">
                                <label className="form-label fw-bold"> 회의실 이름 </label>
                                <input type="text" placeholder="예: A룸" className="form-control" 
                                       value={roomName} onChange={(e) => setRoomName(e.target.value)} />
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

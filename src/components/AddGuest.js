import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const AddGuest = () => {
    // 화면 입력 변수들
    const [deptName, setDeptName] = useState('');   
    const [bookerName, setBookerName] = useState(''); 
    const [count, setCount] = useState('');         
    const [roomName, setRoomName] = useState('');   

    const navigate = useNavigate();
    const { id } = useParams();
    
    // 🔴 [주소] 성공했던 주소
    const API_URL = "https://port-0-cloudtype-backend-template-mg2vve8668cb34cb.sel3.cloudtype.app/api/guests";

    const saveOrUpdateGuest = (e) => {
        e.preventDefault();
        console.log("🌐 전송 시도:", API_URL);

        // 💡 [500 에러 해결 전략: 그릇에 맞게 담기]
        
        // 1. 정보를 합쳐서 문자열 칸(LastName)에 넣습니다.
        // 예: "[A룸] 4명 (개발팀)"
        const fullInfo = `[${roomName}] ${count}명 (${deptName})`;

        // 2. 혹시 모르니 20자로 자릅니다.
        const safeInfo = fullInfo.length > 20 ? fullInfo.substring(0, 20) : fullInfo;

        const guest = { 
            // 1. FirstName: 신청자 이름 (홍길동)
            firstName: bookerName, 
            
            // 2. LastName: 회의실 정보 합친 것
            lastName: safeInfo,       
            
            // 3. Email: 가짜 이메일
            emailId: `user${Date.now()}@test.com`, 
            
            // 🔴 [핵심 수정] 11자리는 너무 큽니다! 
            // 백엔드(int)가 버틸 수 있게 딱 "0" 하나만 보냅니다.
            phone: "0"      
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
                    return response.text().then(errorMessage => {
                        throw new Error(`Server Error (${response.status})`);
                    });
                }
                return response.text().then(text => text ? JSON.parse(text) : {});
            })
            .then(() => {
                alert("✅ 예약 성공! (드디어 해결되었습니다)");
                navigate('/');
            })
            .catch(error => {
                console.error("❌ 실패:", error);
                alert(`저장 실패!\n\n${error.message}`);
            });
    }

    useEffect(() => {
        if (id) {
            fetch(`${API_URL}/${id}`)
                .then(res => res.json())
                .then(data => {
                    setBookerName(data.firstName);
                    // 저장된 데이터 불러와서 화면에 뿌리기
                    setRoomName(data.lastName); 
                    setDeptName("상세확인필요");
                    setCount("0");
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
                                       value={deptName} onChange={(e) => setDeptName(e.target.value)} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold"> 신청자 </label>
                                <input type="text" placeholder="예: 홍길동" className="form-control" 
                                       value={bookerName} onChange={(e) => setBookerName(e.target.value)} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold"> 인원 </label>
                                <input type="number" placeholder="예: 4" className="form-control" 
                                       value={count} onChange={(e) => setCount(e.target.value)} />
                            </div>
                            <div className="form-group mb-4">
                                <label className="form-label fw-bold"> 회의실 이름 </label>
                                <input type="text" placeholder="예: 대회의실 A" className="form-control" 
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

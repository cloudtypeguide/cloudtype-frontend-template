import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const AddGuest = () => {
    // 화면 입력값
    const [deptName, setDeptName] = useState('');   
    const [bookerName, setBookerName] = useState(''); 
    const [count, setCount] = useState('');         
    const [roomName, setRoomName] = useState('');   

    const navigate = useNavigate();
    const { id } = useParams();
    
    // 🔴 [주소] 기존 성공했던 주소 유지
    const API_URL = "https://port-0-cloudtype-backend-template-mg2vve8668cb34cb.sel3.cloudtype.app/api/guests";

    const saveOrUpdateGuest = (e) => {
        e.preventDefault();
        
        // 💡 [핵심 수정] 백엔드 Guest.java 변수명에 정확히 맞춥니다.
        const guest = { 
            // 1. num (int): 인원수 (반드시 숫자여야 함 -> parseInt)
            num: parseInt(count) || 0, 
            
            // 2. name (String): 부서명과 신청자를 합쳐서 보냄
            name: `${deptName} - ${bookerName}`,
            
            // 3. phoneNum (String): 여기에 '회의실 이름'을 넣습니다! (String이라 가능)
            phoneNum: roomName
        };

        console.log("🌐 전송 데이터:", guest);

        const requestOptions = {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guest)
        };

        const url = id ? `${API_URL}/${id}` : API_URL;

        fetch(url, requestOptions)
            .then(response => {
                if(!response.ok) {
                    throw new Error(`Server Error (${response.status})`);
                }
                // 응답이 없을 수도 있으니 text로 받고 처리
                return response.text().then(text => text ? JSON.parse(text) : {});
            })
            .then(() => {
                alert("✅ 예약 성공! (변수명을 맞췄습니다)");
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
                    // 불러올 때도 백엔드 변수명(num, name, phoneNum)으로 받아야 함
                    setCount(data.num); 
                    setRoomName(data.phoneNum); // 회의실 이름 복원
                    
                    // "부서 - 이름" 형태로 저장했으니 다시 쪼개서 보여줌 (단순화)
                    setBookerName(data.name); 
                    setDeptName("정보확인"); 
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
                                <label className="form-label fw-bold"> 인원 (숫자) </label>
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

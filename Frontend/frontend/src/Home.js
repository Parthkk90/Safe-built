// Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ onLogout, addLog }) {
    const [fileTitle, setFileTitle] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [displayContent, setDisplayContent] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [readTitle, setReadTitle] = useState('');

    const navigate = useNavigate();

    const handleUpload = () => {
        if (fileTitle && fileContent) {
            setUploadedFiles((prevFiles) => ({
                ...prevFiles,
                [fileTitle]: fileContent,
            }));
            addLog('uploaded', fileTitle); // 업로드 로그 기록
            alert('파일이 업로드되었습니다.');
            setFileTitle('');
            setFileContent('');
        } else {
            alert('파일 제목과 내용을 입력하세요.');
        }
    };

    const handleRead = () => {
        if (uploadedFiles[readTitle]) {
            setDisplayContent(uploadedFiles[readTitle]);
            addLog('read', readTitle); // 읽기 로그 기록
        } else {
            setDisplayContent("해당 제목의 파일이 없습니다.");
        }
    };

    const goToPage = () => {
        navigate('/page');
    };

    return (
        <div className="container mx-auto p-4 max-w-lg">
            <h1 className="text-2xl font-bold mb-4">메인 페이지</h1>
            
            {/* 파일 업로드 섹션 */}
            <div className="mb-8 p-4 border border-gray-300 shadow-md rounded-md">
                <h2 className="text-xl font-bold mb-4">파일 업로드</h2>
                <input
                    type="text"
                    placeholder="파일 제목 입력"
                    value={fileTitle}
                    onChange={(e) => setFileTitle(e.target.value)}
                    className="p-2 border border-gray-300 rounded mb-2 w-full"
                />
                <input
                    type="text"
                    placeholder="파일 내용 입력"
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    className="p-2 border border-gray-300 rounded mb-2 w-full"
                />
                <button onClick={handleUpload} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Upload File
                </button>
            </div>

            {/* 파일 읽기 섹션 */}
            <div className="p-4 border border-gray-300 shadow-md rounded-md">
                <h2 className="text-xl font-bold mb-4">파일 읽기</h2>
                <input
                    type="text"
                    placeholder="파일 제목 입력"
                    value={readTitle}
                    onChange={(e) => setReadTitle(e.target.value)}
                    className="p-2 border border-gray-300 rounded mb-2 w-full"
                />
                <button onClick={handleRead} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2">
                    Read File
                </button>
                <div className="p-2 border border-gray-300 bg-gray-100 rounded h-16">
                    {displayContent || '파일 내용을 확인하세요.'}
                </div>
            </div>

            {/* Page.js로 이동 버튼 */}
            <button onClick={goToPage} className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4">
                Check Log
            </button>
            
            {/* 로그아웃 버튼 */}
            <button onClick={onLogout} className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 mt-4">
                Logout
            </button>
        </div>
    );
}

export default Home;

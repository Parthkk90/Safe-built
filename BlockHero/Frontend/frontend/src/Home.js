// Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Actor } from '@dfinity/agent';
import { idlFactory as blockhero_idl, canisterId as backendCanisterId } from 'declarations/BlockHero_backend';
import { useIdentity } from './IdentityContext'; // Adjust path if needed
import { useEncryption } from './EncryptionProvider'; // Adjust path if needed

function Home({ onLogout, addLog }) {
    const [fileTitle, setFileTitle] = useState('');
    const [fileContent, setFileContent] = useState(null); // Will hold the File object
    const [displayContent, setDisplayContent] = useState('');
    const [readTitle, setReadTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [actor, setActor] = useState(null);

    const navigate = useNavigate();
    const { authClient } = useIdentity();
    const { encrypt, decrypt } = useEncryption();

    // Create an actor instance when the component mounts and authClient is ready
    useEffect(() => {
        if (authClient) {
            const agent = authClient.getAgent();
            const blockheroActor = Actor.createActor(blockhero_idl, {
                agent,
                canisterId: backendCanisterId,
            });
            setActor(blockheroActor);
        }
    }, [authClient]);

    const handleUpload = async () => {
        if (!fileTitle || !fileContent || !actor) {
            alert('파일 제목과 내용을 선택하세요.');
            return;
        }
        setIsLoading(true);
        try {
            // 1. Read file as a byte array
            const fileBuffer = await fileContent.arrayBuffer();
            const contentBytes = new Uint8Array(fileBuffer);

            // 2. Encrypt the content using our EncryptionProvider
            const encryptedContent = await encrypt(contentBytes);

            // 3. Call the backend canister's upload_file method
            // Note: The backend expects a authority level (e.g., 0 for highest)
            await actor.upload_file(fileTitle, Array.from(encryptedContent), 0);

            addLog('uploaded', fileTitle);
            alert('파일이 안전하게 업로드되었습니다.');
            setFileTitle('');
            setFileContent(null);
            document.getElementById('file-input').value = null; // Reset file input
        } catch (error) {
            console.error("Upload failed:", error);
            alert('업로드에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRead = async () => {
        if (!readTitle || !actor) {
            alert('파일 제목을 입력하세요.');
            return;
        }
        setIsLoading(true);
        setDisplayContent('파일을 읽는 중...');
        try {
            // 1. Call the backend canister to get the encrypted file
            const result = await actor.read_file(readTitle);

            if (result.length > 0) {
                // 2. Decrypt the content using our EncryptionProvider
                const decryptedContent = await decrypt(new Uint8Array(result[0]));
                setDisplayContent(decryptedContent);
                addLog('read', readTitle);
            } else {
                setDisplayContent("해당 제목의 파일이 없거나 접근 권한이 없습니다.");
            }
        } catch (error) {
            console.error("Read failed:", error);
            setDisplayContent("파일을 읽는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const goToPage = () => {
        navigate('/page');
    };

    const buttonClass = (color) => `w-full p-2 bg-${color}-500 text-white rounded hover:bg-${color}-600 disabled:bg-gray-400`;

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
                    id="file-input"
                    type="file"
                    onChange={(e) => setFileContent(e.target.files[0])}
                    className="p-2 border border-gray-300 rounded mb-2 w-full"
                />
                <button onClick={handleUpload} className={buttonClass('blue')} disabled={isLoading}>
                    {isLoading ? '업로드 중...' : 'Upload Secure File'}
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
                <button onClick={handleRead} className={buttonClass('blue')} disabled={isLoading}>
                    {isLoading ? '읽는 중...' : 'Read Secure File'}
                </button>
                <div className="p-2 border border-gray-300 bg-gray-100 rounded min-h-[64px] mt-2 whitespace-pre-wrap break-words">
                    {displayContent || '파일 내용을 확인하세요.'}
                </div>
            </div>

            {/* Page.js로 이동 버튼 */}
            <button onClick={goToPage} className={buttonClass('green') + ' mt-4'}>
                Check Log
            </button>

            {/* 로그아웃 버튼 */}
            <button onClick={onLogout} className={buttonClass('red') + ' mt-4'}>
                Logout
            </button>
        </div>
    );
}

export default Home;

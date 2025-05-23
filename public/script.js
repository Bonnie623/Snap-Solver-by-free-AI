const socket = io();
const uploadedImage = document.getElementById('uploaded-image');
const solveWithImageButton = document.getElementById('solve-with-image-button');
const analyzeTextThenSolveButton = document.getElementById('analyze-text-then-solve-button');
const instruction = document.getElementById('instruction');
const extractedTextContainer = document.getElementById('extracted-text-container');
const extractedTextArea = document.getElementById('extracted-text');
const solveButton = document.getElementById('solve-button');
const answerContainer = document.getElementById('answer-container');
const answerContent = document.getElementById('answer-content');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text');
const imageWrapper = document.getElementById('image-wrapper');
const uploadIcon = document.querySelector('.upload-icon');
const buttonGroup = document.querySelector('.button-group');
let cropper = null;
let uploadedImageData = null;

// 设置marked选项
marked.setOptions({
    breaks: true
});

// 监听新图片上传事件
socket.on('new_image_uploaded', (data) => {
    loadingOverlay.style.display = 'none';
    uploadedImageData = `data:image/png;base64,${data.image}`;
    uploadedImage.src = uploadedImageData;
    imageWrapper.style.display = 'block';
    instruction.textContent = '请框选题目区域。';
    uploadIcon.style.display = 'none';

    buttonGroup.style.display = 'flex'; // 显示两个按钮
    extractedTextContainer.style.display = 'none';
    answerContainer.style.display = 'none';
    answerContent.innerHTML = '';
    extractedTextArea.value = '';

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    cropper = new Cropper(uploadedImage, {
        aspectRatio: NaN,
        viewMode: 1,
        autoCrop: false,
        responsive: true,
        background: false,
        modal: false,
        guides: false,
        center: true,
        highlight: false,
        cropBoxResizable: true,
        cropBoxMovable: true,
        dragMode: 'crop',
        minCropBoxWidth: 50,
        minCropBoxHeight: 50,
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const analyzeTextThenSolveButton = document.getElementById('analyze-text-then-solve-button');

    analyzeTextThenSolveButton.addEventListener('click', () => {
        // 分析文本并解题的逻辑
    });
});

// 分析文本再解题按钮点击事件
// 修改 analyzeTextThenSolveButton 的点击事件处理函数
analyzeTextThenSolveButton.addEventListener('click', () => {
    if (!cropper) {
        alert('没有图片可裁剪。');
        return;
    }

    const cropData = cropper.getData();
    if (cropData.width <= 0 || cropData.height <= 0) {
        alert('请选择有效的裁剪区域。');
        return;
    }

    loadingOverlay.style.display = 'flex';
    loadingText.textContent = '识别文字中...';

    const cropSettings = {
        x: cropData.x,
        y: cropData.y,
        width: cropData.width,
        height: cropData.height
    };

    fetch('/save-crop-settings-and-process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cropSettings, image: uploadedImageData })
    })
        .then(response => response.json())
        .then(data => {
            loadingOverlay.style.display = 'none';
            imageWrapper.style.display = 'none';

            if (cropper) {
                cropper.destroy();
                cropper = null;
            }

            // 显示提取的文本
            extractedTextContainer.style.display = 'block';
            instruction.textContent = '请检查提取的文本是否正确。如果需要修改，请直接编辑文本框中的内容，然后点击"解答题目"。';

            extractedTextArea.value = data.extractedText;

            // 确保答案容器是隐藏的
            answerContainer.style.display = 'none';
            answerContent.innerHTML = '';

            buttonGroup.style.display = 'none'; // 隐藏原有的按钮组
        })
        .catch(err => {
            loadingOverlay.style.display = 'none';
            alert('处理图片时出错，请重试。');
        });
});

// 修改解题按钮的文本和样式
solveButton.textContent = '解答题目'; // 更改按钮文本
solveButton.className = 'primary-button'; // 添加醒目的样式

// 重新定义解题按钮的点击事件处理函数
solveButton.addEventListener('click', () => {
    const userText = extractedTextArea.value.trim();
    if (!userText) {
        alert('请输入有效的文本。');
        return;
    }

    loadingOverlay.style.display = 'flex';
    loadingText.textContent = '解题中...';

    fetch('/solve-problem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ extractedText: userText })
    })
        .then(response => response.json())
        .then(data => {
            loadingOverlay.style.display = 'none';
            answerContainer.style.display = 'block';

            // 更新解题结果
            answerContent.innerHTML = marked.parse(data.answer);

            // 保持文本编辑区域可见，允许用户继续编辑
            instruction.textContent = '您可以继续修改文本并重新解答。';
            extractedTextContainer.style.display = 'block';
        })
        .catch(err => {
            loadingOverlay.style.display = 'none';
            alert('解题时出错，请重试。');
        });
});

// 解题函数
function solveProblem(extractedText) {
    loadingOverlay.style.display = 'flex';
    loadingText.textContent = '解题中...';

    fetch('/solve-problem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ extractedText })
    })
        .then(response => response.json())
        .then(data => {
            loadingOverlay.style.display = 'none';
            answerContainer.style.display = 'block';
            instruction.textContent = '';

            answerContent.innerHTML = marked.parse(data.answer);
        })
        .catch(err => {
            loadingOverlay.style.display = 'none';
            alert('解题时出错，请重试。');
        });
}

// 监听图片上传中事件
socket.on('uploading_image', () => {
    loadingOverlay.style.display = 'flex';
    loadingText.textContent = '上传图片中...';
    instruction.textContent = '';
});

// 删除这段无用的代码
/*
uploadButton.addEventListener('click', () => {
    const fileInput = document.getElementById('image-input');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const base64Image = event.target.result;
            socket.emit('upload_image', base64Image);
        };
        reader.readAsDataURL(file);
    }
});
*/

// 确保直接用图片解题按钮的事件监听器在正确位置
solveWithImageButton.addEventListener('click', () => {
    console.log('直接用图片解题按钮被点击');
    if (!cropper) {
        console.log('错误：没有图片可裁剪');
        alert('没有图片可裁剪。');
        return;
    }

    const cropData = cropper.getData();
    console.log('裁剪数据:', cropData);
    if (cropData.width <= 0 || cropData.height <= 0) {
        console.log('错误：无效的裁剪区域');
        alert('请选择有效的裁剪区域。');
        return;
    }

    loadingOverlay.style.display = 'flex';
    loadingText.textContent = '解题中...';

    const cropSettings = {
        x: cropData.x,
        y: cropData.y,
        width: cropData.width,
        height: cropData.height
    };
    console.log('发送到服务器的数据:', { cropSettings });

    fetch('/solve-with-kimi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cropSettings, image: uploadedImageData })
    })
        .then(response => {
            console.log('服务器响应状态:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('收到服务器答案数据:', data);
            loadingOverlay.style.display = 'none';
            imageWrapper.style.display = 'none';
            buttonGroup.style.display = 'none';

            if (cropper) {
                cropper.destroy();
                cropper = null;
            }

            // 显示答案
            answerContainer.style.display = 'block';
            answerContent.innerHTML = marked.parse(data.answer);
            instruction.textContent = '';
        })
        .catch(err => {
            console.error('解题过程出错:', err);
            loadingOverlay.style.display = 'none';
            alert('解题时出错，请重试。');
        });
});

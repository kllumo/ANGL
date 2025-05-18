document.addEventListener('DOMContentLoaded', function() {
    // File upload handling for main page
    const fileUpload = document.getElementById('file-upload');
    const previewContent = document.getElementById('preview-content');
    const filePreview = document.getElementById('file-preview');
    const emptyState = document.querySelector('.empty-state');
    
    if (fileUpload) {
        fileUpload.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                const file = this.files[0];
                const fileName = file.name;
                const fileSize = formatFileSize(file.size);
                const fileExt = fileName.split('.').pop().toLowerCase();
                
                // Update status indicator
                const statusIndicator = document.querySelector('.status-indicator');
                const statusDot = document.querySelector('.status-dot');
                const statusText = document.querySelector('.status-text');
                
                statusIndicator.classList.add('active');
                statusText.textContent = 'Processing...';
                
                // Hide empty state and show file preview
                if (emptyState) emptyState.classList.add('hidden');
                if (filePreview) filePreview.classList.remove('hidden');
                
                // Update file info
                const fileIcon = document.querySelector('.file-icon');
                const fileName = document.querySelector('.file-name');
                const fileSize = document.querySelector('.file-size');
                
                if (fileIcon) fileIcon.textContent = getFileIcon(fileExt);
                if (fileName) fileName.textContent = file.name;
                if (fileSize) fileSize.textContent = formatFileSize(file.size);
                
                // Simulate processing delay
                setTimeout(() => {
                    statusText.textContent = 'Analysis Complete';
                }, 1500);
            }
        });
    }
    
    // Chatbot page functionality
    const commandCategories = document.querySelectorAll('.command-category');
    const commandGroups = document.querySelectorAll('.command-group');
    const commandItems = document.querySelectorAll('.command-item');
    const chatInput = document.getElementById('chat-input');
    const sendMessage = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    const clearChat = document.getElementById('clear-chat');
    const chatFileUpload = document.getElementById('chat-file-upload');
    const uploadButton = document.getElementById('upload-button');
    
    // Command categories switching
    if (commandCategories.length > 0) {
        commandCategories.forEach(category => {
            category.addEventListener('click', function() {
                // Remove active class from all categories
                commandCategories.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked category
                this.classList.add('active');
                
                // Hide all command groups
                commandGroups.forEach(group => group.classList.add('hidden'));
                
                // Show the corresponding command group
                const categoryName = this.getAttribute('data-category');
                const targetGroup = document.getElementById(`${categoryName}-commands`);
                if (targetGroup) targetGroup.classList.remove('hidden');
            });
        });
    }
    
    // Command items click handling
    if (commandItems.length > 0) {
        commandItems.forEach(item => {
            item.addEventListener('click', function() {
                const command = this.getAttribute('data-command');
                if (chatInput) {
                    chatInput.value = command;
                    chatInput.focus();
                }
            });
        });
    }
    
    // Auto-resize textarea
    if (chatInput) {
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            
            // Reset height if empty
            if (this.value === '') {
                this.style.height = 'auto';
            }
        });
        
        // Send message on Enter (but allow Shift+Enter for new line)
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }
    
    // Send message button click
    if (sendMessage) {
        sendMessage.addEventListener('click', sendChatMessage);
    }
    
    // Clear chat button
    if (clearChat) {
        clearChat.addEventListener('click', function() {
            if (chatMessages) {
                // Keep only the first welcome message
                const welcomeMessage = chatMessages.firstElementChild;
                chatMessages.innerHTML = '';
                if (welcomeMessage) chatMessages.appendChild(welcomeMessage);
            }
        });
    }
    
    // Upload button click
    if (uploadButton && chatFileUpload) {
        uploadButton.addEventListener('click', function() {
            chatFileUpload.click();
        });
    }
    
    // File upload in chat
    if (chatFileUpload) {
        chatFileUpload.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                const file = this.files[0];
                addUserMessage('', [file]);
                
                // Simulate bot response
                showTypingIndicator();
                
                setTimeout(() => {
                    removeTypingIndicator();
                    addBotMessage(`I've received your file "${file.name}" (${formatFileSize(file.size)}). I'll analyze it and get back to you shortly.`);
                    
                    // Simulate analysis completion
                    setTimeout(() => {
                        showTypingIndicator();
                        
                        setTimeout(() => {
                            removeTypingIndicator();
                            addBotMessage(`I've analyzed "${file.name}". This document appears to be about financial projections for Q3 2023. Would you like me to summarize the key points or extract specific information?`);
                        }, 2000);
                    }, 3000);
                }, 1500);
            }
        });
    }
    
    // Function to send a chat message
    function sendChatMessage() {
        if (!chatInput || !chatMessages) return;
        
        const message = chatInput.value.trim();
        if (message === '') return;
        
        // Add user message
        addUserMessage(message);
        
        // Clear input
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        // Simulate bot response
        showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator();
            
            // Generate bot response based on message content
            let botResponse = '';
            
            if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                botResponse = "Hello! I'm your AI assistant. How can I help you today?";
            } else if (message.toLowerCase().includes('help')) {
                botResponse = "I can help you analyze documents, answer questions, and provide insights. You can upload files or ask me specific questions about your data.";
            } else if (message.toLowerCase().includes('summarize')) {
                botResponse = "I'd be happy to summarize your document. The document contains financial projections for Q3 2023, with a focus on revenue growth in the technology sector. Key highlights include a 24% increase in revenue compared to the previous quarter and new market opportunities in the APAC region.";
            } else if (message.toLowerCase().includes('extract') || message.toLowerCase().includes('key points')) {
                botResponse = "Here are the key points from your document:\n\n1. Revenue increased by 24% compared to Q2 2023\n2. New market opportunities identified in APAC region\n3. Cost reduction strategies outlined on pages 15-18\n4. Product launch timeline scheduled for November 2023\n5. Competitive analysis shows 15% market share growth potential";
            } else {
                botResponse = "I understand you're asking about \"" + message + "\". To provide the most accurate response, I'd need to analyze relevant documents. Would you like to upload a file for me to reference?";
            }
            
            addBotMessage(botResponse);
        }, 1500);
        
        // Scroll to bottom
        scrollToBottom();
    }
    
    // Function to add a user message to the chat
    function addUserMessage(message, files = null) {
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        
        let messageHTML = `
            <div class="message-avatar">
                <div class="avatar-icon">You</div>
            </div>
            <div class="message-content">
        `;
        
        if (message) {
            messageHTML += `<p>${escapeHTML(message)}</p>`;
        }
        
        if (files && files.length > 0) {
            files.forEach(file => {
                const fileExtension = file.name.split('.').pop().toLowerCase();
                
                messageHTML += `
                    <div class="message-file">
                        <div class="file-icon">${getFileIcon(fileExtension)}</div>
                        <div class="file-info">
                            <div class="file-name">${escapeHTML(file.name)}</div>
                            <div class="file-size">${formatFileSize(file.size)}</div>
                        </div>
                    </div>
                `;
            });
        }
        
        messageHTML += `</div>`;
        messageHTML += `<div class="message-time">${getCurrentTime()}</div>`;
        
        messageDiv.innerHTML = messageHTML;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Function to add a bot message to the chat
    function addBotMessage(message) {
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-icon">AI</div>
            </div>
            <div class="message-content">
                <p>${formatMessage(message)}</p>
            </div>
            <div class="message-time">${getCurrentTime()}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        if (!chatMessages) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-icon">AI</div>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Helper function to get file icon based on extension
    function getFileIcon(extension) {
        const iconMap = {
            'pdf': 'PDF',
            'doc': 'DOC',
            'docx': 'DOC',
            'xls': 'XLS',
            'xlsx': 'XLS',
            'csv': 'CSV',
            'txt': 'TXT',
            'jpg': 'IMG',
            'jpeg': 'IMG',
            'png': 'IMG',
            'gif': 'IMG'
        };
        
        return iconMap[extension] || 'FILE';
    }
    
    // Helper function to format file size
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' B';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + ' KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }
    }
    
    // Helper function to escape HTML
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag]));
    }
    
    // Helper function to format message with line breaks
    function formatMessage(message) {
        return escapeHTML(message).replace(/\n/g, '<br>');
    }
    
    // Helper function to get current time
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        return `${hours}:${minutes} ${ampm}`;
    }
    
    // Helper function to scroll chat to bottom
    function scrollToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
});

// Add this code to your existing script.js file
// This will handle the simplified chatbot functionality

document.addEventListener('DOMContentLoaded', function() {
    // Existing code remains...
    
    // Simplified chatbot functionality
    const chatInput = document.getElementById('chat-input');
    const sendMessage = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    const clearChat = document.getElementById('clear-chat');
    const chatFileUpload = document.getElementById('chat-file-upload');
    const uploadButton = document.getElementById('upload-button');
    const fileUploadIndicator = document.getElementById('file-upload-indicator');
    const fileName = document.getElementById('file-name');
    const removeFile = document.getElementById('remove-file');
    
    // File upload variables
    let selectedFile = null;
    
    // Auto-resize textarea
    if (chatInput) {
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            
            // Reset height if empty
            if (this.value === '') {
                this.style.height = 'auto';
            }
        });
        
        // Send message on Enter (but allow Shift+Enter for new line)
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }
    
    // Send message button click
    if (sendMessage) {
        sendMessage.addEventListener('click', sendChatMessage);
    }
    
    // Clear chat button
    if (clearChat) {
        clearChat.addEventListener('click', function() {
            if (chatMessages) {
                // Keep only the first welcome message
                const welcomeMessage = chatMessages.firstElementChild;
                chatMessages.innerHTML = '';
                if (welcomeMessage) chatMessages.appendChild(welcomeMessage);
            }
        });
    }
    
    // File upload handling
    if (chatFileUpload) {
        chatFileUpload.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                selectedFile = this.files[0];
                if (fileName) fileName.textContent = selectedFile.name;
                if (fileUploadIndicator) fileUploadIndicator.classList.add('active');
            }
        });
    }
    
    // Remove file button
    if (removeFile) {
        removeFile.addEventListener('click', function() {
            selectedFile = null;
            if (chatFileUpload) chatFileUpload.value = '';
            if (fileName) fileName.textContent = 'No file selected';
            if (fileUploadIndicator) fileUploadIndicator.classList.remove('active');
        });
    }
    
    // Function to send a chat message
    function sendChatMessage() {
        if (!chatInput || !chatMessages) return;
        
        const message = chatInput.value.trim();
        
        // Don't send if both message and file are empty
        if (message === '' && !selectedFile) return;
        
        // Add user message to chat
        addUserMessage(message, selectedFile ? [selectedFile] : null);
        
        // Clear input and file
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        if (selectedFile) {
            selectedFile = null;
            if (chatFileUpload) chatFileUpload.value = '';
            if (fileName) fileName.textContent = 'No file selected';
            if (fileUploadIndicator) fileUploadIndicator.classList.remove('active');
        }
        
        // Simulate bot response (this is where you would integrate with ChatGPT API)
        showTypingIndicator();
        
        // This setTimeout simulates the API call delay
        // Replace this with your actual ChatGPT API integration
        setTimeout(() => {
            removeTypingIndicator();
            
            // Generate bot response based on message content
            let botResponse = '';
            
            if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                botResponse = "Hello! I'm your AI assistant. How can I help you today?";
            } else if (message.toLowerCase().includes('help')) {
                botResponse = "I can help you analyze documents, answer questions, and provide insights. You can upload files or ask me specific questions about your data.";
            } else {
                botResponse = "I understand you're asking about \"" + message + "\". This is where the ChatGPT API would generate a response based on your input.";
            }
            
            addBotMessage(botResponse);
        }, 1500);
        
        // Scroll to bottom
        scrollToBottom();
    }
    
    // Function to add a user message to the chat
    function addUserMessage(message, files = null) {
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        
        let messageHTML = `
            <div class="message-avatar">
                <div class="avatar-icon">You</div>
            </div>
            <div class="message-content">
        `;
        
        if (message) {
            messageHTML += `<p>${escapeHTML(message)}</p>`;
        }
        
        if (files && files.length > 0) {
            files.forEach(file => {
                const fileExtension = file.name.split('.').pop().toLowerCase();
                
                messageHTML += `
                    <div class="message-file">
                        <div class="file-icon">${getFileIcon(fileExtension)}</div>
                        <div class="file-info">
                            <div class="file-name">${escapeHTML(file.name)}</div>
                            <div class="file-size">${formatFileSize(file.size)}</div>
                        </div>
                    </div>
                `;
            });
        }
        
        messageHTML += `</div>`;
        messageHTML += `<div class="message-time">${getCurrentTime()}</div>`;
        
        messageDiv.innerHTML = messageHTML;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Function to add a bot message to the chat
    function addBotMessage(message) {
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-icon">AI</div>
            </div>
            <div class="message-content">
                <p>${formatMessage(message)}</p>
            </div>
            <div class="message-time">${getCurrentTime()}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        if (!chatMessages) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-icon">AI</div>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Helper functions (these may already exist in your script.js)
    function getFileIcon(extension) {
        const iconMap = {
            'pdf': 'PDF',
            'doc': 'DOC',
            'docx': 'DOC',
            'xls': 'XLS',
            'xlsx': 'XLS',
            'csv': 'CSV',
            'txt': 'TXT',
            'jpg': 'IMG',
            'jpeg': 'IMG',
            'png': 'IMG',
            'gif': 'IMG'
        };
        
        return iconMap[extension] || 'FILE';
    }
    
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' B';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + ' KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }
    }
    
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag]));
    }
    
    function formatMessage(message) {
        return escapeHTML(message).replace(/\n/g, '<br>');
    }
    
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        return `${hours}:${minutes} ${ampm}`;
    }
    
    function scrollToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
});


<script src="{{ url_for('static', filename='script/script.js') }}"></script>
// RetailerPro - Enterprise Retail Management Platform
class RetailerPro {
    constructor() {
        this.currentUser = null;
        this.retailers = JSON.parse(localStorage.getItem('retailerpro_retailers')) || [];
        this.prospects = JSON.parse(localStorage.getItem('retailerpro_prospects')) || [];
        this.activities = JSON.parse(localStorage.getItem('retailerpro_activities')) || [];
        this.recruitments = JSON.parse(localStorage.getItem('retailerpro_recruitments')) || [];
        this.servicings = JSON.parse(localStorage.getItem('retailerpro_servicings')) || [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuth();
        this.setDefaultDates();
    }

    bindEvents() {
        // Login forms
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('siboLoginForm').addEventListener('submit', (e) => this.handleSiboLogin(e));
        
        // SIBO login toggle
        document.getElementById('siboLoginBtn').addEventListener('click', () => this.showSiboLogin());
        document.getElementById('backToMainLogin').addEventListener('click', () => this.showMainLogin());
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());

        // Retailer form
        document.getElementById('retailerForm').addEventListener('submit', (e) => this.handleRetailerSubmit(e));
        document.getElementById('addRetailerBtn').addEventListener('click', () => this.showRetailerForm());
        document.getElementById('cancelRetailerBtn').addEventListener('click', () => this.hideRetailerForm());
        document.getElementById('clearRetailerForm').addEventListener('click', () => this.clearRetailerForm());

        // Prospect form
        document.getElementById('prospectForm').addEventListener('submit', (e) => this.handleProspectSubmit(e));
        document.getElementById('addProspectBtn').addEventListener('click', () => this.showProspectForm());
        document.getElementById('cancelProspectBtn').addEventListener('click', () => this.hideProspectForm());
        document.getElementById('clearProspectForm').addEventListener('click', () => this.clearProspectForm());

        // Recruitment form
        document.getElementById('recruitmentForm').addEventListener('submit', (e) => this.handleRecruitmentSubmit(e));
        document.getElementById('addRecruitmentBtn').addEventListener('click', () => this.showRecruitmentForm());
        document.getElementById('cancelRecruitmentBtn').addEventListener('click', () => this.hideRecruitmentForm());
        document.getElementById('clearRecruitmentForm').addEventListener('click', () => this.clearRecruitmentForm());

        // Servicing form
        document.getElementById('servicingForm').addEventListener('submit', (e) => this.handleServicingSubmit(e));
        document.getElementById('addServicingBtn').addEventListener('click', () => this.showServicingForm());
        document.getElementById('cancelServicingBtn').addEventListener('click', () => this.hideServicingForm());
        document.getElementById('clearServicingForm').addEventListener('click', () => this.clearServicingForm());

        // Export buttons
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportAllData());
        document.getElementById('exportRetailersBtn').addEventListener('click', () => this.exportRetailers());
        document.getElementById('exportProspectsBtn').addEventListener('click', () => this.exportProspects());
        document.getElementById('exportRecruitmentBtn').addEventListener('click', () => this.exportRecruitments());
        document.getElementById('exportServicingBtn').addEventListener('click', () => this.exportServicings());

        // Search functionality
        document.getElementById('retailerSearch').addEventListener('input', (e) => this.filterRetailers(e.target.value));
        document.getElementById('prospectSearch').addEventListener('input', (e) => this.filterProspects(e.target.value));
        document.getElementById('recruitmentSearch').addEventListener('input', (e) => this.filterRecruitments(e.target.value));
        document.getElementById('servicingSearch').addEventListener('input', (e) => this.filterServicings(e.target.value));
    }

    checkAuth() {
        const user = JSON.parse(localStorage.getItem('retailerpro_user'));
        if (user && user.isAuthenticated) {
            this.currentUser = user;
            this.showApp();
        } else {
            this.showLogin();
        }
    }

    showSiboLogin() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('siboLoginBtn').style.display = 'none';
        document.getElementById('siboLoginForm').style.display = 'block';
    }

    showMainLogin() {
        document.getElementById('siboLoginForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('siboLoginBtn').style.display = 'block';
    }

    async handleSiboLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const siboPassword = formData.get('siboPassword');

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        
        btnText.textContent = 'Authenticating...';

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (siboPassword === 'SIBO25') {
            this.currentUser = {
                role: 'SIBO_AGENCY',
                name: 'SIBO Agency Admin',
                cluster: 'ALL',
                isAuthenticated: true,
                loginTime: new Date().toISOString()
            };

            localStorage.setItem('retailerpro_user', JSON.stringify(this.currentUser));
            this.showApp();
            this.showToast('Welcome SIBO Agency Admin!', 'success');
        } else {
            this.showToast('Invalid SIBO password. Please contact administrator.', 'error');
        }
        
        btnText.textContent = 'Login as SIBO';
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const password = formData.get('password');
        const userCluster = formData.get('userCluster');

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Validate credentials
        if (password === 'DSR2024') {
            if (!userCluster) {
                this.showToast('Please select your territory/cluster.', 'error');
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
                return;
            }
            
            this.currentUser = {
                role: 'DSR',
                name: `Field Representative (${userCluster})`,
                cluster: userCluster,
                isAuthenticated: true,
                loginTime: new Date().toISOString()
            };
        } else if (password === 'TSM2024') {
            if (!userCluster) {
                this.showToast('Please select your territory/cluster.', 'error');
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
                return;
            }
            
            this.currentUser = {
                role: 'TSM',
                name: `Territory Manager (${userCluster})`,
                cluster: userCluster,
                isAuthenticated: true,
                loginTime: new Date().toISOString()
            };
        } else {
            this.showToast('Invalid password. Please try again.', 'error');
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            return;
        }

        localStorage.setItem('retailerpro_user', JSON.stringify(this.currentUser));
        this.showApp();
        
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        
        this.showToast(`Welcome ${this.currentUser.name}!`, 'success');
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('retailerpro_user');
        this.showLogin();
        this.showToast('Successfully logged out', 'success');
    }

    showLogin() {
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('appSection').style.display = 'none';
        this.showMainLogin(); // Reset to main login form
    }

    showApp() {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('appSection').style.display = 'flex';
        
        this.updateUI();
        this.loadDashboard();
        this.loadRetailers();
        this.loadProspects();
        this.loadRecruitments();
        this.loadServicings();
    }

    updateUI() {
        if (!this.currentUser) return;

        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userRoleBadge').textContent = this.getRoleDisplayName(this.currentUser.role);
        document.getElementById('userAvatar').textContent = this.currentUser.name.charAt(0);

        // Show/hide management section based on role
        const managementSection = document.getElementById('managementSection');
        if (this.currentUser.role === 'TSM' || this.currentUser.role === 'SIBO_AGENCY') {
            managementSection.style.display = 'block';
        } else {
            managementSection.style.display = 'none';
        }

        // Update territory badge
        const territoryBadge = document.getElementById('territoryBadge');
        const territoryName = document.getElementById('territoryName');
        
        if (this.currentUser.cluster && this.currentUser.cluster !== 'ALL') {
            territoryBadge.style.display = 'flex';
            territoryName.textContent = this.currentUser.cluster;
        } else {
            territoryBadge.style.display = 'none';
        }

        // Show/hide DSR fields
        if (this.currentUser.role === 'DSR') {
            document.body.classList.add('user-dsr');
        } else {
            document.body.classList.remove('user-dsr');
        }
    }

    getRoleDisplayName(role) {
        const roles = {
            'DSR': 'Field Representative',
            'TSM': 'Territory Manager',
            'SIBO_AGENCY': 'Agency Admin'
        };
        return roles[role] || role;
    }

    handleNavigation(e) {
        e.preventDefault();
        
        const tab = e.currentTarget.getAttribute('data-tab');
        this.showTab(tab);
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
    }

    showTab(tabId) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('active');
            
            // Update page title
            const pageTitle = document.getElementById('pageTitle');
            const pageSubtitle = document.getElementById('pageSubtitle');
            
            const titles = {
                'dashboard-tab': { title: 'Dashboard', subtitle: 'Performance Overview' },
                'retailers-tab': { title: 'Retailers', subtitle: 'Manage Retailer Network' },
                'prospects-tab': { title: 'Prospects', subtitle: 'Lead Management' },
                'recruitment-tab': { title: 'Recruitment', subtitle: 'Recruitment Status Tracking' },
                'servicing-tab': { title: 'Servicing Float', subtitle: 'Service Management' },
                'performance-tab': { title: 'Performance', subtitle: 'Team Analytics' },
                'reports-tab': { title: 'Reports', subtitle: 'Data & Insights' }
            };

            if (titles[tabId]) {
                pageTitle.textContent = titles[tabId].title;
                pageSubtitle.textContent = titles[tabId].subtitle;
            }
        }
    }

    // Retailer Management
    showRetailerForm() {
        document.getElementById('retailerFormSection').style.display = 'block';
        document.getElementById('addRetailerBtn').style.display = 'none';
    }

    hideRetailerForm() {
        document.getElementById('retailerFormSection').style.display = 'none';
        document.getElementById('addRetailerBtn').style.display = 'block';
    }

    clearRetailerForm() {
        document.getElementById('retailerForm').reset();
        this.setDefaultDates();
    }

    async handleRetailerSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const retailer = {
            id: Date.now().toString(),
            msisdn: formData.get('msisdn'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            businessName: formData.get('businessName'),
            siteId: formData.get('siteId'),
            location: formData.get('location'),
            lines: parseInt(formData.get('lines')) || 0,
            serial1: formData.get('serial1'),
            serial2: formData.get('serial2'),
            visitationDate: formData.get('visitationDate'),
            visitationTime: formData.get('visitationTime'),
            ga_lm: formData.get('ga_lm') === 'on',
            mtd: formData.get('mtd') === 'on',
            qsso: formData.get('qsso') === 'on',
            qama: formData.get('qama') === 'on',
            kcb_agent: formData.get('kcb_agent') === 'on',
            addedBy: this.currentUser.name,
            territory: this.currentUser.cluster,
            status: 'Active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.retailers.unshift(retailer);
        this.saveRetailers();
        
        this.hideRetailerForm();
        this.clearRetailerForm();
        this.loadRetailers();
        this.updateDashboardStats();
        
        this.showToast('Retailer added successfully', 'success');
        this.logActivity(`Added retailer: ${retailer.firstName} ${retailer.lastName}`);
    }

    loadRetailers() {
        const tbody = document.querySelector('#retailersTable tbody');
        const filteredRetailers = this.filterDataByUser(this.retailers);
        
        if (filteredRetailers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="11" style="text-align: center; padding: 2rem;">
                        No retailers found. Click "Add Retailer" to get started.
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = filteredRetailers.map(retailer => `
            <tr>
                <td>${retailer.msisdn}</td>
                <td>${retailer.firstName} ${retailer.lastName}</td>
                <td>${retailer.businessName || '-'}</td>
                <td>${retailer.siteId}</td>
                <td>${retailer.location}</td>
                <td>${retailer.lines}</td>
                <td>${retailer.visitationDate ? this.formatDate(retailer.visitationDate) : '-'}</td>
                <td>${retailer.visitationTime || '-'}</td>
                <td>
                    ${retailer.ga_lm ? '<span class="badge">GA LM</span>' : ''}
                    ${retailer.mtd ? '<span class="badge">MTD</span>' : ''}
                    ${retailer.qsso ? '<span class="badge">QSSO</span>' : ''}
                    ${retailer.qama ? '<span class="badge">QAMA</span>' : ''}
                    ${retailer.kcb_agent ? '<span class="badge">KCB</span>' : ''}
                </td>
                <td><span class="status-badge">${retailer.status}</span></td>
                <td>${this.formatDate(retailer.updatedAt)}</td>
            </tr>
        `).join('');
    }

    filterRetailers(searchTerm) {
        const rows = document.querySelectorAll('#retailersTable tbody tr');
        const term = searchTerm.toLowerCase();
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    }

    // Prospect Management
    showProspectForm() {
        document.getElementById('prospectFormSection').style.display = 'block';
        document.getElementById('addProspectBtn').style.display = 'none';
    }

    hideProspectForm() {
        document.getElementById('prospectFormSection').style.display = 'none';
        document.getElementById('addProspectBtn').style.display = 'block';
    }

    clearProspectForm() {
        document.getElementById('prospectForm').reset();
        this.setDefaultDates();
    }

    async handleProspectSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const prospect = {
            id: Date.now().toString(),
            phone: formData.get('prospectPhone'),
            name: formData.get('prospectName'),
            businessType: formData.get('prospectBusiness'),
            location: formData.get('prospectLocation'),
            visitDate: formData.get('visitDate'),
            followUpDate: formData.get('followUpDate'),
            interestLevel: formData.get('interestLevel'),
            notes: formData.get('prospectNotes'),
            addedBy: this.currentUser.name,
            territory: this.currentUser.cluster,
            status: 'New',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.prospects.unshift(prospect);
        this.saveProspects();
        
        this.hideProspectForm();
        this.clearProspectForm();
        this.loadProspects();
        this.updateDashboardStats();
        
        this.showToast('Prospect added successfully', 'success');
        this.logActivity(`Added prospect: ${prospect.name}`);
    }

    loadProspects() {
        const tbody = document.querySelector('#prospectsTable tbody');
        const filteredProspects = this.filterDataByUser(this.prospects);
        
        if (filteredProspects.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem;">
                        No prospects found. Click "Add Prospect" to get started.
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = filteredProspects.map(prospect => `
            <tr>
                <td>${prospect.phone}</td>
                <td>${prospect.name}</td>
                <td>${prospect.businessType || '-'}</td>
                <td>${prospect.location}</td>
                <td><span class="interest-badge ${prospect.interestLevel?.toLowerCase()}">${prospect.interestLevel}</span></td>
                <td><span class="status-badge">${prospect.status}</span></td>
                <td>${prospect.followUpDate ? this.formatDate(prospect.followUpDate) : 'No follow-up'}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="app.updateProspectStatus('${prospect.id}', 'Contacted')">
                        Contacted
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="app.updateProspectStatus('${prospect.id}', 'Converted')">
                        Convert
                    </button>
                </td>
            </tr>
        `).join('');
    }

    filterProspects(searchTerm) {
        const rows = document.querySelectorAll('#prospectsTable tbody tr');
        const term = searchTerm.toLowerCase();
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    }

    updateProspectStatus(prospectId, status) {
        const prospect = this.prospects.find(p => p.id === prospectId);
        if (prospect) {
            prospect.status = status;
            prospect.updatedAt = new Date().toISOString();
            this.saveProspects();
            this.loadProspects();
            this.showToast(`Prospect marked as ${status}`, 'success');
            this.logActivity(`Updated prospect ${prospect.name} to ${status}`);
        }
    }

    // Recruitment Management
    showRecruitmentForm() {
        document.getElementById('recruitmentFormSection').style.display = 'block';
        document.getElementById('addRecruitmentBtn').style.display = 'none';
        this.setDefaultDates();
    }

    hideRecruitmentForm() {
        document.getElementById('recruitmentFormSection').style.display = 'none';
        document.getElementById('addRecruitmentBtn').style.display = 'block';
    }

    clearRecruitmentForm() {
        document.getElementById('recruitmentForm').reset();
        this.setDefaultDates();
    }

    async handleRecruitmentSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const recruitment = {
            id: Date.now().toString(),
            phone: formData.get('recruitmentPhone'),
            name: formData.get('recruitmentName'),
            businessType: formData.get('recruitmentBusiness'),
            location: formData.get('recruitmentLocation'),
            status: formData.get('recruitmentStatus'),
            recruitmentDate: formData.get('recruitmentDate'),
            notes: formData.get('recruitmentNotes'),
            addedBy: this.currentUser.name,
            territory: this.currentUser.cluster,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.recruitments.unshift(recruitment);
        this.saveRecruitments();
        
        this.hideRecruitmentForm();
        this.clearRecruitmentForm();
        this.loadRecruitments();
        
        this.showToast('Recruitment record added successfully', 'success');
        this.logActivity(`Added recruitment: ${recruitment.name}`);
    }

    loadRecruitments() {
        const tbody = document.querySelector('#recruitmentTable tbody');
        const filteredRecruitments = this.filterDataByUser(this.recruitments);
        
        if (filteredRecruitments.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem;">
                        No recruitment records found. Click "Add Recruitment" to get started.
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = filteredRecruitments.map(recruitment => `
            <tr>
                <td>${recruitment.phone}</td>
                <td>${recruitment.name}</td>
                <td>${recruitment.businessType || '-'}</td>
                <td>${recruitment.location}</td>
                <td><span class="status-badge">${recruitment.status}</span></td>
                <td>${recruitment.recruitmentDate ? this.formatDate(recruitment.recruitmentDate) : '-'}</td>
                <td>${recruitment.addedBy}</td>
            </tr>
        `).join('');
    }

    filterRecruitments(searchTerm) {
        const rows = document.querySelectorAll('#recruitmentTable tbody tr');
        const term = searchTerm.toLowerCase();
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    }

    // Servicing Float Management
    showServicingForm() {
        document.getElementById('servicingFormSection').style.display = 'block';
        document.getElementById('addServicingBtn').style.display = 'none';
        this.populateRetailerDropdown();
        this.setDefaultDates();
    }

    hideServicingForm() {
        document.getElementById('servicingFormSection').style.display = 'none';
        document.getElementById('addServicingBtn').style.display = 'block';
    }

    clearServicingForm() {
        document.getElementById('servicingForm').reset();
        this.setDefaultDates();
    }

    populateRetailerDropdown() {
        const dropdown = document.getElementById('servicingRetailer');
        const filteredRetailers = this.filterDataByUser(this.retailers);
        
        // Clear existing options except the first one
        while (dropdown.options.length > 1) {
            dropdown.remove(1);
        }
        
        // Add retailer options
        filteredRetailers.forEach(retailer => {
            const option = document.createElement('option');
            option.value = retailer.id;
            option.textContent = `${retailer.firstName} ${retailer.lastName} - ${retailer.businessName || 'No Business'}`;
            dropdown.appendChild(option);
        });
    }

    async handleServicingSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const retailerId = formData.get('servicingRetailer');
        const retailer = this.retailers.find(r => r.id === retailerId);
        
        const servicing = {
            id: Date.now().toString(),
            retailerId: retailerId,
            retailerName: retailer ? `${retailer.firstName} ${retailer.lastName}` : 'Unknown Retailer',
            retailerBusiness: retailer ? retailer.businessName : '',
            serviceType: formData.get('servicingType'),
            amount: parseFloat(formData.get('servicingAmount')) || 0,
            serviceDate: formData.get('servicingDate'),
            status: formData.get('servicingStatus'),
            description: formData.get('servicingDescription'),
            addedBy: this.currentUser.name,
            territory: this.currentUser.cluster,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.servicings.unshift(servicing);
        this.saveServicings();
        
        this.hideServicingForm();
        this.clearServicingForm();
        this.loadServicings();
        
        this.showToast('Servicing record added successfully', 'success');
        this.logActivity(`Added servicing for: ${servicing.retailerName}`);
    }

    loadServicings() {
        const tbody = document.querySelector('#servicingTable tbody');
        const filteredServicings = this.filterDataByUser(this.servicings);
        
        if (filteredServicings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem;">
                        No servicing records found. Click "Add Servicing" to get started.
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = filteredServicings.map(servicing => `
            <tr>
                <td>${servicing.retailerName}</td>
                <td>${servicing.serviceType}</td>
                <td>${servicing.amount > 0 ? `KES ${servicing.amount.toLocaleString()}` : '-'}</td>
                <td>${servicing.serviceDate ? this.formatDate(servicing.serviceDate) : '-'}</td>
                <td><span class="status-badge">${servicing.status}</span></td>
                <td>${servicing.description || '-'}</td>
                <td>${servicing.addedBy}</td>
            </tr>
        `).join('');
    }

    filterServicings(searchTerm) {
        const rows = document.querySelectorAll('#servicingTable tbody tr');
        const term = searchTerm.toLowerCase();
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    }

    // Dashboard
    loadDashboard() {
        this.updateDashboardStats();
        this.loadRecentActivity();
    }

    updateDashboardStats() {
        const filteredRetailers = this.filterDataByUser(this.retailers);
        const filteredProspects = this.filterDataByUser(this.prospects);
        const convertedProspects = filteredProspects.filter(p => p.status === 'Converted');
        
        document.getElementById('activeRetailers').textContent = filteredRetailers.length;
        document.getElementById('totalProspects').textContent = filteredProspects.length;
        
        const conversionRate = filteredProspects.length > 0 
            ? Math.round((convertedProspects.length / filteredProspects.length) * 100)
            : 0;
        document.getElementById('conversionRate').textContent = `${conversionRate}%`;
        
        const targetAchievement = Math.min(100, Math.round((filteredRetailers.length / 75) * 100));
        document.getElementById('targetAchievement').textContent = `${targetAchievement}%`;
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${targetAchievement}%`;
        }
    }

    loadRecentActivity() {
        const container = document.getElementById('recentActivity');
        const recentActivities = this.activities.slice(0, 5);
        
        if (recentActivities.length === 0) {
            container.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">📝</div>
                    <div class="activity-content">
                        <div class="activity-text">Welcome to RetailerPro! Start by adding your first retailer.</div>
                        <div class="activity-time">Just now</div>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recentActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">📝</div>
                <div class="activity-content">
                    <div class="activity-text">${activity.action}</div>
                    <div class="activity-time">${this.formatTime(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    // Data Management
    filterDataByUser(data) {
        if (this.currentUser.role === 'SIBO_AGENCY') {
            return data;
        }
        return data.filter(item => item.territory === this.currentUser.cluster);
    }

    saveRetailers() {
        localStorage.setItem('retailerpro_retailers', JSON.stringify(this.retailers));
    }

    saveProspects() {
        localStorage.setItem('retailerpro_prospects', JSON.stringify(this.prospects));
    }

    saveRecruitments() {
        localStorage.setItem('retailerpro_recruitments', JSON.stringify(this.recruitments));
    }

    saveServicings() {
        localStorage.setItem('retailerpro_servicings', JSON.stringify(this.servicings));
    }

    logActivity(action) {
        const activity = {
            action,
            user: this.currentUser.name,
            timestamp: new Date().toISOString()
        };
        this.activities.unshift(activity);
        localStorage.setItem('retailerpro_activities', JSON.stringify(this.activities));
    }

    // Export functionality
    exportAllData() {
        const data = {
            retailers: this.filterDataByUser(this.retailers),
            prospects: this.filterDataByUser(this.prospects),
            recruitments: this.filterDataByUser(this.recruitments),
            servicings: this.filterDataByUser(this.servicings),
            exportedAt: new Date().toISOString(),
            exportedBy: this.currentUser.name
        };
        
        this.downloadJSON(data, `retailerpro_export_${this.formatDateForExport()}.json`);
        this.showToast('All data exported successfully', 'success');
    }

    exportRetailers() {
        const data = this.filterDataByUser(this.retailers);
        this.downloadCSV(this.convertToCSV(data), `retailers_${this.formatDateForExport()}.csv`);
        this.showToast('Retailers exported successfully', 'success');
    }

    exportProspects() {
        const data = this.filterDataByUser(this.prospects);
        this.downloadCSV(this.convertToCSV(data), `prospects_${this.formatDateForExport()}.csv`);
        this.showToast('Prospects exported successfully', 'success');
    }

    exportRecruitments() {
        const data = this.filterDataByUser(this.recruitments);
        this.downloadCSV(this.convertToCSV(data), `recruitments_${this.formatDateForExport()}.csv`);
        this.showToast('Recruitments exported successfully', 'success');
    }

    exportServicings() {
        const data = this.filterDataByUser(this.servicings);
        this.downloadCSV(this.convertToCSV(data), `servicings_${this.formatDateForExport()}.csv`);
        this.showToast('Servicings exported successfully', 'success');
    }

    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const value = row[header] || '';
                return `"${String(value).replace(/"/g, '""')}"`;
            }).join(','))
        ].join('\n');
        
        return csv;
    }

    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        this.downloadBlob(blob, filename);
    }

    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadBlob(blob, filename);
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Utility Methods
    formatDate(dateString) {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    formatTime(dateString) {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDateForExport() {
        return new Date().toISOString().split('T')[0];
    }

    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const visitDate = document.getElementById('visitDate');
        const followUpDate = document.getElementById('followUpDate');
        const visitationDate = document.getElementById('visitationDate');
        const recruitmentDate = document.getElementById('recruitmentDate');
        const servicingDate = document.getElementById('servicingDate');
        
        if (visitDate) visitDate.value = today;
        if (followUpDate) followUpDate.value = nextWeek;
        if (visitationDate) visitationDate.value = today;
        if (recruitmentDate) recruitmentDate.value = today;
        if (servicingDate) servicingDate.value = today;
    }

    // Toast notifications
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${this.getToastIcon(type)}</span>
            <span class="toast-message">${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }
}

// Initialize the application
const app = new RetailerPro();

// Global function for tab navigation
function showTab(tabId) {
    app.showTab(tabId);
}
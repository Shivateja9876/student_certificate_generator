CREATE TABLE students (
    admission_no VARCHAR(30) PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    aadhaar_no VARCHAR(12),

    date_of_birth DATE,
    mother_tongue VARCHAR(50),
    nationality VARCHAR(50),
    state VARCHAR(50),
    religion VARCHAR(50),
    caste_details VARCHAR(100),
    identification_marks VARCHAR(255),

    parent_guardian_name VARCHAR(100),
    relation_type ENUM('S/O', 'D/O', 'G/O'),
    mother_name VARCHAR(100),
    parent_guardian_occupation VARCHAR(100),
    residence_address TEXT,

    school_and_class_from VARCHAR(150),
    date_of_admission DATE,
    class_on_admission VARCHAR(20),
    medium_of_instruction VARCHAR(50),

    eslc_produced ENUM('Yes', 'No'),
    transfer_certificate_produced ENUM('Yes', 'No'),
    tc_eslc_number VARCHAR(50),
    tc_eslc_date DATE,

    smallpox_protected ENUM('Yes', 'No'),

    class_on_leaving VARCHAR(20),
    date_of_leaving DATE,
    reason_for_leaving VARCHAR(255),
    school_joined_after_leaving VARCHAR(150),
    remarks TEXT,

    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

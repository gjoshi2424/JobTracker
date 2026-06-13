DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
        CREATE TYPE application_status AS ENUM (
            'APPLIED',
            'RECRUITER_SCREEN',
            'INTERVIEW',
            'OFFER',
            'REJECTED'
        );
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    status application_status NOT NULL DEFAULT 'APPLIED',
    "dateApplied" TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1. 테이블 생성

-- cm_user_t 테이블
CREATE TABLE cm_user_t (
    user_id varchar NOT NULL,
    user_pw varchar NOT NULL,
    user_level int4 NOT NULL,
    CONSTRAINT cm_user_t_pk PRIMARY KEY (user_id)
);
COMMENT ON TABLE public.cm_user_t IS '공통_user_tb';

-- cm_board_t 테이블
CREATE TABLE cm_board_t (
    post_id varchar NOT NULL,
    content varchar NULL,
    req_user_id varchar NULL,
    res_user_id varchar NULL,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
    coord_x float8 NULL,
    coord_y float8 NULL,
    co_address varchar NULL,
    co_status int4 NULL,
    post_file varchar NULL,
    CONSTRAINT cm_board_t_pk PRIMARY KEY (post_id),
    CONSTRAINT unique_post_file UNIQUE (post_file)
);
COMMENT ON COLUMN public.cm_board_t.category IS 'categorizing post';

-- cm_comment_t 테이블
CREATE TABLE cm_comment_t (
    comment_id varchar NOT NULL,
    post_id varchar NOT NULL,
    parent_id varchar NULL,
    user_id varchar NULL,
    "comment" varchar NOT NULL,
    created_at timestamp NOT NULL, 
    updated_at timestamp NOT NULL, 
    CONSTRAINT cm_comment_t_pk PRIMARY KEY (comment_id),
    CONSTRAINT cm_comment_t_cm_board_t_fk FOREIGN KEY (post_id) REFERENCES cm_board_t(post_id) ON DELETE CASCADE
);
COMMENT ON TABLE public.cm_comment_t IS 'comment & reply';

-- cm_file_t 테이블
CREATE TABLE cm_file_t (
    file_id varchar NOT NULL,
    post_file varchar NOT NULL,
    file_path varchar NOT NULL,
    file_size varchar NOT NULL,
    file_mimetype varchar NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    file_name varchar NOT NULL, -- file_originalname
    file_extension varchar NOT NULL,
    CONSTRAINT cm_file_t_pk PRIMARY KEY (file_id),
    CONSTRAINT cm_file_t_cm_board_t_fk FOREIGN KEY (post_file) REFERENCES cm_board_t(post_file) ON DELETE CASCADE
);
COMMENT ON COLUMN public.cm_file_t.file_name IS 'file_originalname';

-- 2. 트리거 함수 생성

CREATE OR REPLACE FUNCTION public.set_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
    BEGIN
        -- INSERT 시 created_at과 updated_at에 현재 시간 설정
        IF TG_OP = 'INSERT' THEN
            NEW.created_at := CURRENT_TIMESTAMP;
            NEW.updated_at := CURRENT_TIMESTAMP;
        -- UPDATE 시 updated_at만 현재 시간으로 갱신
        ELSIF TG_OP = 'UPDATE' THEN
            NEW.updated_at := CURRENT_TIMESTAMP;
        END IF;
        RETURN NEW;
    END;
$function$;

COMMENT ON FUNCTION public.set_timestamp() IS '생성시각과 수정시각 설정 트리거';

-- 3. 각 테이블에 트리거 적용

-- cm_board_t에 트리거 적용
CREATE TRIGGER trigger_set_timestamp_board 
BEFORE INSERT OR UPDATE ON public.cm_board_t 
FOR EACH ROW EXECUTE FUNCTION set_timestamp();

-- cm_comment_t에 트리거 적용
CREATE TRIGGER trigger_set_timestamp_comment 
BEFORE INSERT OR UPDATE ON public.cm_comment_t 
FOR EACH ROW EXECUTE FUNCTION set_timestamp();

-- 4. 관리자 유저, Markdown 추가
INSERT INTO cm_user_t (user_id, user_pw, user_level) VALUES ('dev001', '$2a$10$mMlEnNQbdmIjG.7eyxWstuez165utVqSgvwggQHzaeAakYS7RhYwy', 0);
UPDATE cm_user_t SET user_level = 0 WHERE user_id = 'dev001'; -- 혹시 몰라서 해둔거 실배포 때는 삭제
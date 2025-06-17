FROM postgres:15-alpine

RUN mkdir -p /etc/postgresql/postgresql.conf.d

COPY ./postgresql.conf /etc/postgresql/postgresql.conf

RUN chown -R postgres:postgres /etc/postgresql

EXPOSE 5432

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"] 
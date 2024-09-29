# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)
    name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class DjangoAdminLog(models.Model):
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('UsersUser', models.DO_NOTHING)
    action_time = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class FinancesFinance(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=5)  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    date = models.DateField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField()
    edited_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    deleted = models.BooleanField()
    finance_category = models.ForeignKey('FinancesFinancecategory', models.DO_NOTHING)
    finance_type = models.ForeignKey('FinancesFinancetype', models.DO_NOTHING)
    group = models.ForeignKey('GroupsGroup', models.DO_NOTHING)
    pay_method = models.ForeignKey('FinancesPaymethod', models.DO_NOTHING)
    split_method = models.ForeignKey('FinancesSplitmethod', models.DO_NOTHING)
    payer = models.ForeignKey('GroupsMember', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'finances_finance'


class FinancesFinancecategory(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'finances_financecategory'


class FinancesFinancetype(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'finances_financetype'


class FinancesPaymethod(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'finances_paymethod'


class FinancesSplit(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=5)  # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    created_at = models.DateTimeField()
    edited_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    deleted = models.BooleanField()
    finance = models.ForeignKey(FinancesFinance, models.DO_NOTHING)
    member = models.ForeignKey('GroupsMember', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'finances_split'


class FinancesSplitmethod(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'finances_splitmethod'


class GroupsCurrency(models.Model):
    currency = models.CharField(unique=True, max_length=20)

    class Meta:
        managed = False
        db_table = 'groups_currency'


class GroupsGrades(models.Model):
    name = models.CharField(max_length=20)
    admin = models.BooleanField()
    edit = models.BooleanField()
    view = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'groups_grades'


class GroupsGroup(models.Model):
    name = models.CharField(max_length=20)
    created_at = models.DateTimeField()
    edited_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    deleted = models.BooleanField()
    category = models.ForeignKey('GroupsGroupCategory', models.DO_NOTHING)
    currency = models.ForeignKey(GroupsCurrency, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'groups_group'


class GroupsGroupCategory(models.Model):
    name = models.CharField(unique=True, max_length=20)

    class Meta:
        managed = False
        db_table = 'groups_group_category'


class GroupsMember(models.Model):
    name = models.CharField(max_length=20)
    active = models.BooleanField()
    deleted = models.BooleanField()
    balance = models.IntegerField()
    grades = models.ForeignKey(GroupsGrades, models.DO_NOTHING)
    group = models.ForeignKey(GroupsGroup, models.DO_NOTHING)
    user = models.ForeignKey('UsersUser', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'groups_member'


class UsersUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()
    email = models.CharField(unique=True, max_length=254)
    nickname = models.CharField(max_length=100)
    edited_at = models.DateTimeField()
    deleted = models.BooleanField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users_user'


class UsersUserGroups(models.Model):
    user = models.ForeignKey(UsersUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_user_groups'
        unique_together = (('user', 'group'),)


class UsersUserUserPermissions(models.Model):
    user = models.ForeignKey(UsersUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_user_user_permissions'
        unique_together = (('user', 'permission'),)

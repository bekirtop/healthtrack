class Validators {
  static String? required(String? value, {String field = 'Bu alan'}) {
    if (value == null || value.trim().isEmpty) {
      return '$field boş bırakılamaz';
    }
    return null;
  }

  static String? username(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Kullanıcı adı boş bırakılamaz';
    }
    if (value.length < 3) {
      return 'Kullanıcı adı en az 3 karakter olmalıdır';
    }
    return null;
  }

  static String? password(String? value) {
    if (value == null || value.isEmpty) {
      return 'Şifre boş bırakılamaz';
    }
    if (value.length < 4) {
      return 'Şifre en az 4 karakter olmalıdır';
    }
    return null;
  }

  static String? email(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'E-posta boş bırakılamaz';
    }
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(value)) {
      return 'Geçerli bir e-posta adresi girin';
    }
    return null;
  }

  static String? phone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Telefon numarası boş bırakılamaz';
    }
    final phoneRegex = RegExp(r'^[0-9]{10,11}$');
    if (!phoneRegex.hasMatch(value.replaceAll(RegExp(r'[^\d]'), ''))) {
      return 'Geçerli bir telefon numarası girin';
    }
    return null;
  }

  static String? minLength(String? value, int min, {String field = 'Bu alan'}) {
    if (value == null || value.isEmpty) {
      return '$field boş bırakılamaz';
    }
    if (value.length < min) {
      return '$field en az $min karakter olmalıdır';
    }
    return null;
  }

  static String? maxLength(String? value, int max, {String field = 'Bu alan'}) {
    if (value != null && value.length > max) {
      return '$field en fazla $max karakter olmalıdır';
    }
    return null;
  }
}

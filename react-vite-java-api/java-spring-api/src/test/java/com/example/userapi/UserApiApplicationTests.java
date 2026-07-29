package com.example.userapi;

import com.example.userapi.model.User;
import com.example.userapi.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class UserApiApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void readAllFiltersByOptionalNameAndEmail() {
		UserService userService = new UserService();
		User alice = userService.create(new User(null, "Alice", "alice@example.com"));
		User bob = userService.create(new User(null, "Bob", "bob@example.com"));

		assertEquals(2, userService.readAll(null, null).size());
		assertEquals(
				List.of(alice),
				userService.readAll("Alice", null));
		assertEquals(
				List.of(bob),
				userService.readAll(null, "bob@example.com"));
		assertEquals(
				List.of(alice),
				userService.readAll("Alice", "alice@example.com"));
		assertEquals(
				List.of(),
				userService.readAll("Alice", "bob@example.com"));
	}

}
